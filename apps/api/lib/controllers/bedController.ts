import mongoose from "mongoose";
import roomCategoryModel from "../models/roomCategoryModel";
import bedAllocationModel from "../models/bedAllocationModel";
import hospitalModel from "../models/hospitalModel";
import { connectDB } from "../db";
import { verifyHospital } from "../auth";
import { json, bad } from "../http";

const recalcHospitalBeds = async (hospitalId: string) => {
  const categories = await roomCategoryModel.find({ hospitalId });
  const totalBeds = categories.reduce((sum, c) => sum + c.totalBeds, 0);
  const availableBeds = categories.reduce((sum, c) => sum + c.availableBeds, 0);
  await hospitalModel.findByIdAndUpdate(hospitalId, {
    totalBeds,
    availableBeds,
  });
};

export async function addRoomCategory(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { hospitalId, name, totalBeds, availableBeds } = await request.json();

    if (!hospitalId || !name || totalBeds === undefined) {
      return json({ success: false, message: "Required data missing" }, undefined, request);
    }

    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return json({ success: false, message: "Hospital not found" }, undefined, request);
    }

    const total = Number(totalBeds);
    const available = Number(availableBeds ?? totalBeds);

    if (total < 0 || available < 0) {
      return json({ success: false, message: "Bed counts cannot be negative" }, undefined, request);
    }
    if (available > total) {
      return json({
        success: false,
        message: "Available beds cannot exceed total beds",
      }, undefined, request);
    }

    const existing = await roomCategoryModel.findOne({ hospitalId, name });
    if (existing) {
      return json({
        success: false,
        message: "Room category already exists for this hospital",
      }, undefined, request);
    }

    const category = new roomCategoryModel({
      hospitalId,
      name,
      totalBeds: total,
      availableBeds: available,
    });
    await category.save();
    await recalcHospitalBeds(hospitalId);

    return json({ success: true, message: "Room category added", category }, undefined, request);
  } catch (error) {
    console.log("Error in addRoomCategory:", error);
    return bad((error as Error).message, request);
  }
}

export async function updateRoomCategory(request: Request): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const { categoryId, totalBeds, availableBeds, name } = await request.json();

    if (!categoryId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Category ID required" }, undefined, request);
    }

    const category = await roomCategoryModel
      .findById(categoryId)
      .session(session);
    if (!category) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Category not found" }, undefined, request);
    }

    const newTotal =
      totalBeds !== undefined ? Number(totalBeds) : category.totalBeds;
    const newAvailable =
      availableBeds !== undefined
        ? Number(availableBeds)
        : category.availableBeds;

    if (newTotal < 0 || newAvailable < 0) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Bed counts cannot be negative" }, undefined, request);
    }
    if (newAvailable > newTotal) {
      await session.abortTransaction();
      session.endSession();
      return json({
        success: false,
        message: "Available beds cannot exceed total beds",
      }, undefined, request);
    }

    category.totalBeds = newTotal;
    category.availableBeds = newAvailable;
    if (name) category.name = name;
    await category.save({ session });

    await session.commitTransaction();
    session.endSession();

    await recalcHospitalBeds(category.hospitalId.toString());

    return json({ success: true, message: "Room category updated", category }, undefined, request);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in updateRoomCategory:", error);
    return bad((error as Error).message, request);
  }
}

export async function getRoomCategories(
  request: Request,
  hospitalId: string
): Promise<Response> {
  try {
    await connectDB();
    const categories = await roomCategoryModel.find({ hospitalId });
    return json({ success: true, categories }, undefined, request);
  } catch (error) {
    console.log("Error in getRoomCategories:", error);
    return bad((error as Error).message, request);
  }
}

export async function getPublicRoomAvailability(
  request: Request,
  hospitalId: string
): Promise<Response> {
  try {
    await connectDB();
    const categories = await roomCategoryModel
      .find({ hospitalId })
      .select("name availableBeds totalBeds");
    return json({ success: true, categories }, undefined, request);
  } catch (error) {
    console.log("Error in getPublicRoomAvailability:", error);
    return bad((error as Error).message, request);
  }
}

export async function admitPatient(request: Request): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const { hospitalId, roomCategoryId, patientId, admissionDate } =
      await request.json();

    if (!hospitalId || !roomCategoryId || !patientId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Required data missing" }, undefined, request);
    }

    const category = await roomCategoryModel
      .findById(roomCategoryId)
      .session(session);
    if (!category) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Room category not found" }, undefined, request);
    }

    if (category.availableBeds <= 0) {
      await session.abortTransaction();
      session.endSession();
      return json({
        success: false,
        message: "No beds available in this category",
      }, undefined, request);
    }

    category.availableBeds -= 1;
    await category.save({ session });

    const allocation = new bedAllocationModel({
      hospitalId,
      roomCategoryId,
      patientId,
      admissionDate: admissionDate || new Date(),
      status: "admitted",
    });
    await allocation.save({ session });

    await session.commitTransaction();
    session.endSession();

    await recalcHospitalBeds(hospitalId);

    return json({ success: true, message: "Patient admitted", allocation }, undefined, request);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in admitPatient:", error);
    return bad((error as Error).message, request);
  }
}

export async function dischargePatient(request: Request): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const { allocationId, dischargeDate } = await request.json();

    if (!allocationId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Allocation ID required" }, undefined, request);
    }

    const allocation = await bedAllocationModel
      .findById(allocationId)
      .session(session);
    if (!allocation) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Allocation not found" }, undefined, request);
    }

    if (allocation.status !== "admitted") {
      await session.abortTransaction();
      session.endSession();
      return json({
        success: false,
        message: "Patient is not currently admitted",
      }, undefined, request);
    }

    allocation.status = "discharged";
    allocation.dischargeDate = dischargeDate || new Date();
    await allocation.save({ session });

    const category = await roomCategoryModel
      .findById(allocation.roomCategoryId)
      .session(session);
    if (category) {
      category.availableBeds = Math.min(
        category.availableBeds + 1,
        category.totalBeds
      );
      await category.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    await recalcHospitalBeds(allocation.hospitalId.toString());

    return json({ success: true, message: "Patient discharged", allocation }, undefined, request);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in dischargePatient:", error);
    return bad((error as Error).message, request);
  }
}

export async function getAllocationHistory(
  request: Request,
  hospitalId: string
): Promise<Response> {
  try {
    await connectDB();
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "20";

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const skipCount = (pageNumber - 1) * limitNumber;

    const allocations = await bedAllocationModel
      .find({ hospitalId })
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limitNumber);

    const totalCount = await bedAllocationModel.countDocuments({ hospitalId });

    return json({
      success: true,
      allocations,
      pagination: { page: pageNumber, limit: limitNumber, total: totalCount },
    }, undefined, request);
  } catch (error) {
    console.log("Error in getAllocationHistory:", error);
    return bad((error as Error).message, request);
  }
}

export async function hospitalAddRoomCategory(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = await verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message, request);
    const hospitalId = auth.hospitalId!;
    const { name, totalBeds, availableBeds } = await request.json();

    if (!name || totalBeds === undefined) {
      return json({
        success: false,
        message: "Name and total beds required",
      }, undefined, request);
    }

    const total = Number(totalBeds);
    const available = Number(availableBeds ?? totalBeds);
    if (total < 0 || available < 0)
      return json({ success: false, message: "Bed counts cannot be negative" }, undefined, request);
    if (available > total)
      return json({
        success: false,
        message: "Available beds cannot exceed total beds",
      }, undefined, request);

    const existing = await roomCategoryModel.findOne({ hospitalId, name });
    if (existing)
      return json({
        success: false,
        message: "Room category already exists",
      }, undefined, request);

    const category = new roomCategoryModel({
      hospitalId,
      name,
      totalBeds: total,
      availableBeds: available,
    });
    await category.save();
    await recalcHospitalBeds(hospitalId);

    return json({ success: true, message: "Room category added", category }, undefined, request);
  } catch (error) {
    console.log("Error in hospitalAddRoomCategory:", error);
    return bad((error as Error).message, request);
  }
}

export async function hospitalUpdateRoomCategory(
  request: Request
): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const auth = await verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) {
      await session.abortTransaction();
      session.endSession();
      return bad(auth.message, request);
    }
    const hospitalId = auth.hospitalId!;
    const { categoryId, totalBeds, availableBeds, name } =
      await request.json();
    if (!categoryId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Category ID required" }, undefined, request);
    }

    const category = await roomCategoryModel
      .findById(categoryId)
      .session(session);
    if (!category) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Category not found" }, undefined, request);
    }
    if (category.hospitalId.toString() !== hospitalId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Unauthorized" }, undefined, request);
    }

    const newTotal =
      totalBeds !== undefined ? Number(totalBeds) : category.totalBeds;
    const newAvailable =
      availableBeds !== undefined
        ? Number(availableBeds)
        : category.availableBeds;
    if (newTotal < 0 || newAvailable < 0) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Bed counts cannot be negative" }, undefined, request);
    }
    if (newAvailable > newTotal) {
      await session.abortTransaction();
      session.endSession();
      return json({
        success: false,
        message: "Available beds cannot exceed total beds",
      }, undefined, request);
    }

    category.totalBeds = newTotal;
    category.availableBeds = newAvailable;
    if (name) category.name = name;
    await category.save({ session });

    await session.commitTransaction();
    session.endSession();
    await recalcHospitalBeds(hospitalId);

    return json({ success: true, message: "Room category updated", category }, undefined, request);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in hospitalUpdateRoomCategory:", error);
    return bad((error as Error).message, request);
  }
}

export async function hospitalGetRoomCategories(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = await verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message, request);
    const categories = await roomCategoryModel.find({ hospitalId: auth.hospitalId });
    return json({ success: true, categories }, undefined, request);
  } catch (error) {
    console.log("Error in hospitalGetRoomCategories:", error);
    return bad((error as Error).message, request);
  }
}

export async function hospitalAdmitPatient(
  request: Request
): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const auth = await verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) {
      await session.abortTransaction();
      session.endSession();
      return bad(auth.message, request);
    }
    const hospitalId = auth.hospitalId!;
    const { roomCategoryId, patientId, admissionDate } =
      await request.json();
    if (!roomCategoryId || !patientId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Required data missing" }, undefined, request);
    }

    const category = await roomCategoryModel
      .findById(roomCategoryId)
      .session(session);
    if (!category) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Room category not found" }, undefined, request);
    }
    if (category.hospitalId.toString() !== hospitalId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Unauthorized" }, undefined, request);
    }
    if (category.availableBeds <= 0) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "No beds available" }, undefined, request);
    }

    category.availableBeds -= 1;
    await category.save({ session });

    const allocation = new bedAllocationModel({
      hospitalId,
      roomCategoryId,
      patientId,
      admissionDate: admissionDate || new Date(),
      status: "admitted",
    });
    await allocation.save({ session });

    await session.commitTransaction();
    session.endSession();
    await recalcHospitalBeds(hospitalId);

    return json({ success: true, message: "Patient admitted", allocation }, undefined, request);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in hospitalAdmitPatient:", error);
    return bad((error as Error).message, request);
  }
}

export async function hospitalDischargePatient(
  request: Request
): Promise<Response> {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await connectDB();
    const auth = await verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) {
      await session.abortTransaction();
      session.endSession();
      return bad(auth.message, request);
    }
    const hospitalId = auth.hospitalId!;
    const { allocationId, dischargeDate } = await request.json();
    if (!allocationId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Allocation ID required" }, undefined, request);
    }

    const allocation = await bedAllocationModel
      .findById(allocationId)
      .session(session);
    if (!allocation) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Allocation not found" }, undefined, request);
    }
    if (allocation.hospitalId.toString() !== hospitalId) {
      await session.abortTransaction();
      session.endSession();
      return json({ success: false, message: "Unauthorized" }, undefined, request);
    }
    if (allocation.status !== "admitted") {
      await session.abortTransaction();
      session.endSession();
      return json({
        success: false,
        message: "Patient is not currently admitted",
      }, undefined, request);
    }

    allocation.status = "discharged";
    allocation.dischargeDate = dischargeDate || new Date();
    await allocation.save({ session });

    const category = await roomCategoryModel
      .findById(allocation.roomCategoryId)
      .session(session);
    if (category) {
      category.availableBeds = Math.min(
        category.availableBeds + 1,
        category.totalBeds
      );
      await category.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    await recalcHospitalBeds(hospitalId);

    return json({ success: true, message: "Patient discharged", allocation }, undefined, request);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error in hospitalDischargePatient:", error);
    return bad((error as Error).message, request);
  }
}

export async function hospitalGetAllocationHistory(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = await verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message, request);
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "20";
    const status = url.searchParams.get("status");

    const pageNumber = Math.max(parseInt(page, 10), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const skipCount = (pageNumber - 1) * limitNumber;

    const filter: Record<string, unknown> = { hospitalId: auth.hospitalId };
    if (
      status &&
      ["admitted", "discharged", "transferred"].includes(status)
    ) {
      filter.status = status;
    }

    const allocations = await bedAllocationModel
      .find(filter)
      .populate("roomCategoryId", "name")
      .populate("patientId", "name email image")
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limitNumber);

    const totalCount = await bedAllocationModel.countDocuments(filter);

    return json({
      success: true,
      allocations,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalCount,
      },
    }, undefined, request);
  } catch (error) {
    console.log("Error in hospitalGetAllocationHistory:", error);
    return bad((error as Error).message, request);
  }
}
