import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import doctorModel from "../models/doctorModel";
import hospitalModel from "../models/hospitalModel";
import appointmentModel from "../models/appointmentModel";
import razorpay from "razorpay";
import { connectDB } from "../db";
import { uploadImageToCloudinary } from "../upload";
import { json, bad } from "../http";
import { verifyUser } from "../auth";

function getRazorpay() {
  return new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
  });
}

export async function registerUser(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { name, email, password } = await request.json();
    if (!name || !password || !email) {
      return json({ success: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return json({ success: false, message: "Enter a valid email" });
    }
    if (!validator.isStrongPassword(password)) {
      return json({
        success: false,
        message:
          "Password is not strong enough. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const userData = { name, email, password: hashedpassword };
    const newUser = new userModel(userData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "");
    return json({ success: true, token });
  } catch (error) {
    console.log("Error in add user to db:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function loginUser(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { email, password } = await request.json();
    const user = await userModel.findOne({ email });
    if (!user) {
      return json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "");
      return json({ success: true, token });
    }
    return json({ success: false, message: "Invalid credentials" });
  } catch (error) {
    console.log("Error in user login:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function getUserProfile(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);
    const userId = auth.userId;
    const userData = await userModel.findById(userId).select("-password");
    return json({ success: true, userData });
  } catch (error) {
    console.log("Error in getting user data:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function updateUserProfile(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);
    const userId = auth.userId;

    const formData = await request.formData();
    const get = (k: string) => {
      const v = formData.get(k);
      return typeof v === "string" ? v : undefined;
    };
    const name = get("name");
    const phone = get("phone");
    const dob = get("dob");
    const gender = get("gender");
    const address = get("address");
    const imageFile = formData.get("image");

    if (!name || !phone || !dob || !gender) {
      return json({ success: false, message: "data Missing" });
    }

    const updateData: Record<string, unknown> = {
      name,
      phone,
      dob,
      gender,
    };
    if (address) {
      try {
        updateData.address = JSON.parse(address);
      } catch {
        updateData.address = { line1: address, line2: "" };
      }
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    if (imageFile instanceof File) {
      const imageUrl = await uploadImageToCloudinary(imageFile);
      if (imageUrl) {
        await userModel.findByIdAndUpdate(userId, { image: imageUrl });
      }
    }
    return json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error in updating user profile:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function bookAppointment(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);
    const userId = auth.userId;

    const { docId, slotDate, slotTime, appointmentType, symptoms, notes } =
      await request.json();

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return json({ success: false, message: "Doctor not available" });
    }

    const slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return json({ success: false, message: "Slot not available" });
      }
      slots_booked[slotDate].push(slotTime);
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    const docDataClone = docData.toObject();
    delete docDataClone.slots_booked;

    const appointmentData = {
      userId,
      docId,
      hospitalId: docData.hospitalId || "",
      slotDate,
      slotTime,
      userData,
      docData: docDataClone,
      amount: docData.fees,
      date: Date.now(),
      appointmentType: appointmentType || "in-person",
      symptoms: symptoms || "",
      notes: notes || "",
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    return json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.log("Error in creating the appointment:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function getUserAppointments(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);
    const userId = auth.userId;
    const appointments = await appointmentModel.find({ userId });
    return json({ success: true, appointments });
  } catch (error) {
    console.log("Error in fetching user appointments:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function rateAppointment(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);
    const userId = auth.userId;

    const { appointmentId, rating, review } = await request.json();
    if (!userId || !appointmentId || !rating) {
      return json({ success: false, message: "Missing required data" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return json({ success: false, message: "Appointment not found" });
    }
    if (appointment.userId !== userId) {
      return json({ success: false, message: "Unauthorized" });
    }
    if (!appointment.isCompleted) {
      return json({ success: false, message: "Cannot rate before completion" });
    }
    if (appointment.rating) {
      return json({ success: false, message: "Appointment already rated" });
    }

    appointment.rating = rating;
    appointment.review = review || "";
    appointment.ratedAt = Date.now();
    await appointment.save();

    const doc = await doctorModel.findById(appointment.docId);
    if (doc) {
      const prevCount = doc.ratingCount || 0;
      const newCount = prevCount + 1;
      const prevAvg = doc.ratingAverage || 0;
      const newAvg = (prevAvg * prevCount + rating) / newCount;
      doc.ratingCount = newCount;
      doc.ratingAverage = newAvg;
      doc.reviews.push({ userId, rating, comment: review || "" });
      await doc.save();
    }

    if (appointment.hospitalId) {
      const hosp = await hospitalModel.findById(appointment.hospitalId);
      if (hosp) {
        const prevCount = hosp.ratingCount || 0;
        const newCount = prevCount + 1;
        const prevAvg = hosp.ratingAverage || 0;
        const newAvg = (prevAvg * prevCount + rating) / newCount;
        hosp.ratingCount = newCount;
        hosp.ratingAverage = newAvg;
        hosp.reviews.push({ userId, rating, comment: review || "" });
        await hosp.save();
      }
    }

    return json({ success: true, message: "Rating submitted successfully" });
  } catch (error) {
    console.log("Error in rateAppointment:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function getStats(request: Request): Promise<Response> {
  try {
    await connectDB();
    const userCount = await userModel.countDocuments();
    const doctorCount = await doctorModel.countDocuments();
    const hospitalCount = await hospitalModel.countDocuments();
    return json({ success: true, userCount, doctorCount, hospitalCount });
  } catch (error) {
    console.log("Error in getStats:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function cancelUserAppointment(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);
    const userId = auth.userId;

    const { appointmentId } = await request.json();
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData.userId !== userId) {
      return json({ success: false, message: "Unauthorized action" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const docData = await doctorModel.findById(docId);
    const slots_booked = docData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (time: string) => time !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    return json({ success: true, message: "Appointment cancled successfully" });
  } catch (error) {
    console.log("Error in cancelling user appointment:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function rescheduleAppointment(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);
    const userId = auth.userId;

    const { appointmentId, newSlotDate, newSlotTime } = await request.json();
    if (!appointmentId || !newSlotDate || !newSlotTime) {
      return json({ success: false, message: "Missing required data" });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return json({ success: false, message: "Appointment not found" });
    }
    if (appointment.userId !== userId) {
      return json({ success: false, message: "Unauthorized action" });
    }
    if (appointment.cancelled || appointment.isCompleted) {
      return json({ success: false, message: "Cannot reschedule this appointment" });
    }

    const docData = await doctorModel.findById(appointment.docId);
    if (!docData) {
      return json({ success: false, message: "Doctor not found" });
    }

    const slots_booked = docData.slots_booked || {};
    if (slots_booked[newSlotDate] && slots_booked[newSlotDate].includes(newSlotTime)) {
      return json({ success: false, message: "New slot not available" });
    }

    const oldDate = appointment.slotDate;
    const oldTime = appointment.slotTime;
    if (slots_booked[oldDate]) {
      slots_booked[oldDate] = slots_booked[oldDate].filter(
        (t: string) => t !== oldTime
      );
    }
    if (!slots_booked[newSlotDate]) {
      slots_booked[newSlotDate] = [];
    }
    slots_booked[newSlotDate].push(newSlotTime);

    await doctorModel.findByIdAndUpdate(appointment.docId, { slots_booked });
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      slotDate: newSlotDate,
      slotTime: newSlotTime,
      rescheduled: true,
    });
    return json({
      success: true,
      message: "Appointment rescheduled successfully",
    });
  } catch (error) {
    console.log("Error in rescheduling appointment:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function paymentRazorpay(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);

    const { appointmentId } = await request.json();
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return json({
        success: false,
        message: "Appointment cancelled or not found",
      });
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: appointmentId.toString(),
    };
    const order = await getRazorpay().orders.create(options);
    return json({ success: true, order });
  } catch (error) {
    console.log("Error making payment:", error);
    return json({ success: false, message: (error as Error).message });
  }
}

export async function verifyRazorpay(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyUser(request.headers.get("token"));
    if (!auth.ok) return bad(auth.message);

    const { razorpay_order_id } = await request.json();
    const orderInfo = await getRazorpay().orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      return json({ success: true, message: "Payment successfully" });
    }
    return json({ success: false, message: "Payment Failed" });
  } catch (error) {
    console.log("Error making payment:", error);
    return json({ success: false, message: (error as Error).message });
  }
}
