import billingModel from "../models/billingModel";
import hospitalModel from "../models/hospitalModel";
import doctorModel from "../models/doctorModel";
import appointmentModel from "../models/appointmentModel";
import bedAllocationModel from "../models/bedAllocationModel";
import { connectDB } from "../db";
import { json, bad } from "../http";
import { verifyHospital } from "../auth";

export async function generateBilling(request: Request): Promise<Response> {
  try {
    await connectDB();
    const {
      hospitalId,
      billingPeriodStart,
      billingPeriodEnd,
      commissionPercentage = 10,
    } = await request.json();

    if (!hospitalId || !billingPeriodStart || !billingPeriodEnd) {
      return json({
        success: false,
        message: "Hospital ID and billing period are required",
      });
    }

    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return json({ success: false, message: "Hospital not found" });
    }

    const startDate = new Date(billingPeriodStart);
    const endDate = new Date(billingPeriodEnd);

    if (startDate >= endDate) {
      return json({ success: false, message: "Invalid date range" });
    }

    const doctors = await doctorModel.find({ hospitalId }).select("_id");
    const doctorIds = doctors.map((d) => d._id.toString());

    if (doctorIds.length === 0) {
      return json({
        success: false,
        message: "No doctors found for this hospital",
      });
    }

    const appointments = await appointmentModel.find({
      docId: { $in: doctorIds },
      isCompleted: true,
      cancelled: { $ne: true },
      date: {
        $gte: startDate.getTime(),
        $lte: endDate.getTime(),
      },
    });

    const totalAppointments = appointments.length;
    const totalRevenue = appointments.reduce(
      (sum, a) => sum + (a.amount || 0),
      0
    );
    const commissionAmount = Math.round(
      (totalRevenue * Number(commissionPercentage)) / 100
    );
    const netPayable = totalRevenue - commissionAmount;

    const allocations = await bedAllocationModel
      .find({
        hospitalId,
        $or: [
          { admissionDate: { $gte: startDate, $lte: endDate } },
          { status: "admitted", admissionDate: { $lte: endDate } },
        ],
      })
      .populate("roomCategoryId", "dailyRate name");

    let bedRevenue = 0;
    allocations.forEach((a) => {
      const cat = a.roomCategoryId as unknown as {
        dailyRate?: number;
      } | null;
      const rate = cat?.dailyRate || 0;
      const admitDate = new Date(a.admissionDate);
      const discharge = a.dischargeDate
        ? new Date(a.dischargeDate)
        : endDate;
      const effStart = admitDate < startDate ? startDate : admitDate;
      const effEnd = discharge > endDate ? endDate : discharge;
      const days = Math.max(
        1,
        Math.ceil((effEnd.getTime() - effStart.getTime()) / (1000 * 60 * 60 * 24))
      );
      bedRevenue += days * rate;
    });

    const grandTotal = netPayable + bedRevenue;

    const billing = new billingModel({
      hospitalId,
      totalAppointments,
      totalRevenue,
      commissionPercentage,
      commissionAmount,
      netPayable,
      bedAllocations: allocations.length,
      bedRevenue,
      grandTotal,
      billingPeriodStart: startDate,
      billingPeriodEnd: endDate,
      status: "Pending",
    });

    await billing.save();

    return json({
      success: true,
      message: "Billing generated successfully",
      billing,
    });
  } catch (error) {
    console.log("Error in generateBilling:", error);
    return bad((error as Error).message);
  }
}

export async function listBillings(request: Request): Promise<Response> {
  try {
    await connectDB();
    const url = new URL(request.url);
    const hospitalId = url.searchParams.get("hospitalId");
    const status = url.searchParams.get("status");
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "20";

    const filter: Record<string, unknown> = {};
    if (hospitalId) filter.hospitalId = hospitalId;
    if (status && ["Pending", "Paid"].includes(status)) filter.status = status;

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const total = await billingModel.countDocuments(filter);
    const billings = await billingModel
      .find(filter)
      .populate("hospitalId", "name city image")
      .sort({ billingPeriodEnd: -1 })
      .skip(skip)
      .limit(limitNum);

    return json({
      success: true,
      billings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.log("Error in listBillings:", error);
    return bad((error as Error).message);
  }
}

export async function markBillingPaid(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { billingId } = await request.json();

    if (!billingId) {
      return json({ success: false, message: "Billing ID is required" });
    }

    const billing = await billingModel.findById(billingId);
    if (!billing) {
      return json({ success: false, message: "Billing not found" });
    }

    if (billing.status === "Paid") {
      return json({
        success: false,
        message: "Billing is already marked as paid",
      });
    }

    billing.status = "Paid";
    await billing.save();

    return json({ success: true, message: "Billing marked as paid" });
  } catch (error) {
    console.log("Error in markBillingPaid:", error);
    return bad((error as Error).message);
  }
}

export async function getHospitalBillings(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message);
    const hospitalId = auth.hospitalId!;

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "20";

    const filter: Record<string, unknown> = { hospitalId };
    if (status && ["Pending", "Paid"].includes(status)) filter.status = status;

    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const total = await billingModel.countDocuments(filter);
    const billings = await billingModel
      .find(filter)
      .sort({ billingPeriodEnd: -1 })
      .skip(skip)
      .limit(limitNum);

    return json({
      success: true,
      billings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.log("Error in getHospitalBillings:", error);
    return bad((error as Error).message);
  }
}

export async function hospitalGenerateBilling(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyHospital(request.headers.get("htoken"));
    if (!auth.ok) return bad(auth.message);
    const hospitalId = auth.hospitalId!;

    const {
      billingPeriodStart,
      billingPeriodEnd,
      commissionPercentage = 10,
    } = await request.json();

    if (!billingPeriodStart || !billingPeriodEnd) {
      return json({ success: false, message: "Billing period is required" });
    }

    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return json({ success: false, message: "Hospital not found" });
    }

    const startDate = new Date(billingPeriodStart);
    const endDate = new Date(billingPeriodEnd);

    if (startDate >= endDate) {
      return json({ success: false, message: "Invalid date range" });
    }

    const doctors = await doctorModel.find({ hospitalId }).select("_id");
    const doctorIds = doctors.map((d) => d._id.toString());

    if (doctorIds.length === 0) {
      return json({
        success: false,
        message: "No doctors found for this hospital",
      });
    }

    const appointments = await appointmentModel.find({
      docId: { $in: doctorIds },
      isCompleted: true,
      cancelled: { $ne: true },
      date: {
        $gte: startDate.getTime(),
        $lte: endDate.getTime(),
      },
    });

    const totalAppointments = appointments.length;
    const totalRevenue = appointments.reduce(
      (sum, a) => sum + (a.amount || 0),
      0
    );
    const commissionAmount = Math.round(
      (totalRevenue * Number(commissionPercentage)) / 100
    );
    const netPayable = totalRevenue - commissionAmount;

    const allocations = await bedAllocationModel
      .find({
        hospitalId,
        $or: [
          { admissionDate: { $gte: startDate, $lte: endDate } },
          { status: "admitted", admissionDate: { $lte: endDate } },
        ],
      })
      .populate("roomCategoryId", "dailyRate name");

    let bedRevenue = 0;
    allocations.forEach((a) => {
      const cat = a.roomCategoryId as unknown as {
        dailyRate?: number;
      } | null;
      const rate = cat?.dailyRate || 0;
      const admitDate = new Date(a.admissionDate);
      const discharge = a.dischargeDate
        ? new Date(a.dischargeDate)
        : endDate;
      const effStart = admitDate < startDate ? startDate : admitDate;
      const effEnd = discharge > endDate ? endDate : discharge;
      const days = Math.max(
        1,
        Math.ceil((effEnd.getTime() - effStart.getTime()) / (1000 * 60 * 60 * 24))
      );
      bedRevenue += days * rate;
    });

    const grandTotal = netPayable + bedRevenue;

    const billing = new billingModel({
      hospitalId,
      totalAppointments,
      totalRevenue,
      commissionPercentage,
      commissionAmount,
      netPayable,
      bedAllocations: allocations.length,
      bedRevenue,
      grandTotal,
      billingPeriodStart: startDate,
      billingPeriodEnd: endDate,
      status: "Pending",
    });

    await billing.save();

    return json({
      success: true,
      message: "Billing generated successfully",
      billing,
    });
  } catch (error) {
    console.log("Error in hospitalGenerateBilling:", error);
    return bad((error as Error).message);
  }
}
