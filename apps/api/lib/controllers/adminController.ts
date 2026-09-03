import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel";
import appointmentModel from "../models/appointmentModel";
import userModel from "../models/userModel";
import hospitalModel from "../models/hospitalModel";
import { connectDB } from "../db";
import { getCloudinary } from "../cloudinary";
import { uploadImageToCloudinary } from "../upload";
import { json, bad } from "../http";
import { verifyAdmin } from "../auth";

export async function loginAdmin(request: Request): Promise<Response> {
  try {
    const { email, password } = await request.json();
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PW) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET || "");
      return json({ success: true, token });
    }
    return json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    console.log("Error in login admin:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function addDoctor(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyAdmin(request.headers.get("atoken"));
    if (!auth.ok) return bad(auth.message);

    const formData = await request.formData();
    const get = (k: string) => formData.get(k);
    const name = get("name");
    const email = get("email");
    const password = get("password");
    const speciality = get("speciality");
    const experience = get("experience");
    const degree = get("degree");
    const about = get("about");
    const fees = get("fees");
    const address = get("address");
    const hospitalId = get("hospitalId");
    const imageFile = formData.get("image");

    if (
      !name || !email || !password || !speciality || !experience ||
      !degree || !about || !fees || !address || !hospitalId
    ) {
      return json({ success: false, message: "All fields are required" });
    }

    const hospital = await hospitalModel.findById(String(hospitalId));
    if (!hospital) {
      return json({ success: false, message: "Hospital not found" });
    }
    if (!hospital.isRegistered) {
      return json({
        success: false,
        message: "Doctor can only be assigned to a registered hospital",
      });
    }

    if (!validator.isEmail(String(email))) {
      return json({ success: false, message: "Invalid email address" });
    }
    if (!validator.isStrongPassword(String(password))) {
      return json({
        success: false,
        message:
          "Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(String(password), salt);

    const imageUrl = await uploadImageToCloudinary(
      imageFile instanceof File ? imageFile : null
    );

    const doctorData = {
      name: String(name),
      email: String(email),
      password: hashedpassword,
      image: imageUrl,
      speciality: String(speciality),
      experience: Number(experience),
      degree: String(degree),
      about: String(about),
      fees: Number(fees),
      address: JSON.parse(String(address)),
      hospitalId,
      date: Date.now(),
      slots_booked: {},
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    return json({ success: true, message: "Doctor added successfully" });
  } catch (error) {
    console.log("Error in addDoctor:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function allDoctors(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyAdmin(request.headers.get("atoken"));
    if (!auth.ok) return bad(auth.message);
    const doctors = await doctorModel.find({}).select("-password");
    return json({ success: true, doctors });
  } catch (error) {
    console.log("Error in fetching all doctors:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function appointmentsAdmin(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyAdmin(request.headers.get("atoken"));
    if (!auth.ok) return bad(auth.message);

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const docId = url.searchParams.get("docId");
    const appointmentType = url.searchParams.get("appointmentType");
    const search = url.searchParams.get("search");
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);

    const filter: Record<string, unknown> = {};
    if (status === "cancelled") {
      filter.cancelled = true;
    } else if (status === "completed") {
      filter.isCompleted = true;
      filter.cancelled = { $ne: true };
    } else if (status === "active") {
      filter.cancelled = { $ne: true };
      filter.isCompleted = { $ne: true };
    }
    if (docId) filter.docId = docId;
    if (appointmentType && ["in-person", "video"].includes(appointmentType)) {
      filter.appointmentType = appointmentType;
    }
    if (search) {
      filter["userData.name"] = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const total = await appointmentModel.countDocuments(filter);
    const appointments = await appointmentModel
      .find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return json({
      success: true,
      appointments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.log("Error in admin appointments:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function appointmentCancel(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyAdmin(request.headers.get("atoken"));
    if (!auth.ok) return bad(auth.message);

    const { appointmentId } = await request.json();
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    const slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (time: string) => time !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return json({
      success: true,
      message: "Appointment cancled successfully",
    });
  } catch (error) {
    console.log("Error in cancelling user appointment:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function adminDashboard(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyAdmin(request.headers.get("atoken"));
    if (!auth.ok) return bad(auth.message);

    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashboardData = {
      doctors: doctors.length,
      patients: users.length,
      appointments: appointments.length,
      latestAppointments: appointments.slice(-5),
    };

    return json({ success: true, dashboardData });
  } catch (error) {
    console.log("Error in admin Dashboard:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function hospitalManagement(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyAdmin(request.headers.get("atoken"));
    if (!auth.ok) return bad(auth.message);

    const url = new URL(request.url);
    const page = Math.max(Number(url.searchParams.get("page") || 1), 1);
    const limit = Math.min(
      Math.max(Number(url.searchParams.get("limit") || 20), 1),
      50
    );
    const search = url.searchParams.get("search");
    const status = url.searchParams.get("status");

    const matchStage: Record<string, unknown> = {};
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "registered") matchStage.isRegistered = true;
    if (status === "unregistered") matchStage.isRegistered = false;

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "hospitalId",
          as: "doctorsList",
        },
      },
      {
        $addFields: {
          totalDoctors: { $size: "$doctorsList" },
          doctorIds: "$doctorsList._id",
        },
      },
      {
        $lookup: {
          from: "appointments",
          let: { docIds: "$doctorIds" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$docId",
                    {
                      $map: {
                        input: "$$docIds",
                        as: "d",
                        in: { $toString: "$$d" },
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: "appointmentsList",
        },
      },
      {
        $addFields: {
          totalAppointments: { $size: "$appointmentsList" },
          totalRevenue: { $sum: "$appointmentsList.amount" },
        },
      },
      {
        $project: {
          name: 1,
          city: 1,
          image: 1,
          isRegistered: 1,
          isAvailable: 1,
          totalDoctors: 1,
          totalAppointments: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalAppointments: -1, _id: -1 } },
      {
        $facet: {
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [result] = await hospitalModel.aggregate(pipeline);
    const hospitals = result?.data || [];
    const total = result?.total?.[0]?.count || 0;

    return json({
      success: true,
      hospitals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("Error in hospitalManagement:", error);
    return json({ success: false, message: (error as Error).message });
  }
}
