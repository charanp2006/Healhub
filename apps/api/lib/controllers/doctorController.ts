import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel";
import appointmentModel from "../models/appointmentModel";
import { connectDB } from "../db";
import { json, bad } from "../http";
import { verifyDoctor } from "../auth";

export async function changeAvailability(request: Request): Promise<Response> {
  try {
    await connectDB();
    const body = await request.json();
    const docId = body.doctorId || body.docId;

    const doctorData = await doctorModel.findById(docId);
    if (!doctorData) {
      return json({ success: false, message: "Doctor not found" });
    }
    await doctorModel.findByIdAndUpdate(docId, {
      available: !doctorData.available,
    });
    return json({
      success: true,
      message: "Doctor availability updated successfully",
    });
  } catch (error) {
    console.log("Error in changeAvailability:", error);
    return bad((error as Error).message);
  }
}

export async function doctorList(request: Request): Promise<Response> {
  try {
    await connectDB();
    const doctors = await doctorModel
      .find({})
      .select(["-password", "-email"])
      .populate("hospitalId", "name city image");
    return json({ success: true, doctors });
  } catch (error) {
    console.log("Error in doctorList:", error);
    return bad((error as Error).message);
  }
}

export async function doctorLogin(request: Request): Promise<Response> {
  try {
    await connectDB();
    const { email, password } = await request.json();
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET || "");
      return json({
        success: true,
        message: "Doctor login successful",
        token,
      });
    } else {
      return json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in doctorLogin:", error);
    return bad((error as Error).message);
  }
}

export async function getDoctorAppointments(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;
    const appointments = await appointmentModel.find({ docId });
    return json({ success: true, appointments });
  } catch (error) {
    console.log("Error in getDoctorAppointments:", error);
    return bad((error as Error).message);
  }
}

export async function cancelDoctorAppointment(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { appointmentId } = await request.json();
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId == docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return json({
        success: true,
        message: "Appointment Cancelled Successfully",
      });
    } else {
      return json({
        success: false,
        message: "Appointment not found or unauthorized",
      });
    }
  } catch (error) {
    console.log("Error in cancelling doctor appointment:", error);
    return bad((error as Error).message);
  }
}

export async function completeDoctorAppointment(
  request: Request
): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { appointmentId, prescription, followUpDate } = await request.json();
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId == docId) {
      const updateData: Record<string, unknown> = { isCompleted: true };
      if (prescription) updateData.prescription = prescription;
      if (followUpDate) updateData.followUpDate = followUpDate;
      await appointmentModel.findByIdAndUpdate(appointmentId, updateData);
      return json({
        success: true,
        message: "Appointment marked as completed",
      });
    } else {
      return json({
        success: false,
        message: "Appointment not found or unauthorized",
      });
    }
  } catch (error) {
    console.log("Error in completing doctor appointment:", error);
    return bad((error as Error).message);
  }
}

export async function addPrescription(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { appointmentId, prescription, followUpDate } = await request.json();

    if (!appointmentId || !prescription) {
      return json({
        success: false,
        message: "Appointment ID and prescription are required",
      });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.docId != docId) {
      return json({ success: false, message: "Unauthorized action" });
    }

    if (appointmentData.cancelled) {
      return json({
        success: false,
        message: "Cannot add prescription to cancelled appointment",
      });
    }

    const updateData: Record<string, unknown> = { prescription };
    if (followUpDate) updateData.followUpDate = followUpDate;

    await appointmentModel.findByIdAndUpdate(appointmentId, updateData);

    return json({ success: true, message: "Prescription added successfully" });
  } catch (error) {
    console.log("Error in addPrescription:", error);
    return bad((error as Error).message);
  }
}

export async function doctorDashboard(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.map((appointment) => {
      if (appointment.isCompleted || !appointment.payment) {
        earnings += appointment.amount;
      }
    });

    const patients: string[] = [];
    appointments.map((appointment) => {
      if (!patients.includes(appointment.userId)) {
        patients.push(appointment.userId);
      }
    });

    const dashboardData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    return json({ success: true, dashboardData });
  } catch (error) {
    console.log("Error in doctorDashboard:", error);
    return bad((error as Error).message);
  }
}

export async function doctorProfile(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const profileData = await doctorModel.findById(docId).select("-password");

    return json({ success: true, profileData });
  } catch (error) {
    console.log("Error in getting user data:", error);
    return bad((error as Error).message);
  }
}

export async function updateDoctorProfile(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { fees, address, available } = await request.json();

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    return json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error in updating user profile:", error);
    return bad((error as Error).message);
  }
}

export async function updateDoctorSchedule(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { schedule, slotDuration } = await request.json();

    const updateData: Record<string, unknown> = {};
    if (schedule) updateData.schedule = schedule;
    if (slotDuration) updateData.slotDuration = slotDuration;

    await doctorModel.findByIdAndUpdate(docId, updateData);

    return json({ success: true, message: "Schedule updated successfully" });
  } catch (error) {
    console.log("Error updating schedule:", error);
    return bad((error as Error).message);
  }
}

export async function getDoctorBlockedDates(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const doctor = await doctorModel
      .findById(docId)
      .select("blockedDates schedule slotDuration");

    return json({
      success: true,
      blockedDates: (doctor.blockedDates as unknown[]) || [],
      schedule: doctor.schedule,
      slotDuration: doctor.slotDuration,
    });
  } catch (error) {
    console.log("Error getting blocked dates:", error);
    return bad((error as Error).message);
  }
}

export async function getDoctorScheduleForBooking(
  request: Request,
  docId: string
): Promise<Response> {
  try {
    await connectDB();
    const doctor = await doctorModel
      .findById(docId)
      .select("schedule slotDuration blockedDates");

    if (!doctor) {
      return json({ success: false, message: "Doctor not found" });
    }

    return json({
      success: true,
      schedule: doctor.schedule || {},
      slotDuration: doctor.slotDuration || 30,
      blockedDates: doctor.blockedDates || [],
    });
  } catch (error) {
    console.log("Error getting doctor schedule for booking:", error);
    return bad((error as Error).message);
  }
}

export async function addBlockedDates(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { dates, reason } = await request.json();

    if (!dates || !Array.isArray(dates)) {
      return json({ success: false, message: "Please provide dates array" });
    }

    const doctor = await doctorModel.findById(docId);
    const existingDates = (doctor.blockedDates as unknown[]) || [];
    const newDates = [...new Set([...existingDates, ...dates])];

    await doctorModel.findByIdAndUpdate(docId, { blockedDates: newDates });

    return json({
      success: true,
      message: "Dates blocked successfully",
      blockedDates: newDates,
    });
  } catch (error) {
    console.log("Error adding blocked dates:", error);
    return bad((error as Error).message);
  }
}

export async function removeBlockedDates(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const { dates } = await request.json();

    if (!dates || !Array.isArray(dates)) {
      return json({ success: false, message: "Please provide dates array" });
    }

    const doctor = await doctorModel.findById(docId);
    const existingDates = (doctor.blockedDates as unknown[]) || [];
    const newDates = existingDates.filter((d) => !dates.includes(d));

    await doctorModel.findByIdAndUpdate(docId, { blockedDates: newDates });

    return json({
      success: true,
      message: "Dates unblocked successfully",
      blockedDates: newDates,
    });
  } catch (error) {
    console.log("Error removing blocked dates:", error);
    return bad((error as Error).message);
  }
}

export async function doctorAnalytics(request: Request): Promise<Response> {
  try {
    await connectDB();
    const auth = verifyDoctor(request.headers.get("dtoken"));
    if (!auth.ok) return bad(auth.message);
    const docId = auth.docId!;

    const appointments = await appointmentModel.find({ docId }).lean();

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const lastMonthEnd = thisMonthStart;

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter((a) => a.isCompleted).length;
    const cancelledAppointments = appointments.filter((a) => a.cancelled).length;
    const activeAppointments = appointments.filter(
      (a) => !a.cancelled && !a.isCompleted
    ).length;

    const completionRate =
      totalAppointments > 0
        ? Math.round((completedAppointments / totalAppointments) * 100)
        : 0;

    const thisMonthAppointments = appointments.filter(
      (a) => a.date >= thisMonthStart
    ).length;
    const lastMonthAppointments = appointments.filter(
      (a) => a.date >= lastMonthStart && a.date < lastMonthEnd
    ).length;
    const appointmentGrowth =
      lastMonthAppointments > 0
        ? Math.round(
            ((thisMonthAppointments - lastMonthAppointments) /
              lastMonthAppointments) *
              100
          )
        : thisMonthAppointments > 0
        ? 100
        : 0;

    const totalRevenue = appointments
      .filter((a) => a.isCompleted || a.payment)
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const thisMonthRevenue = appointments
      .filter(
        (a) =>
          a.date >= thisMonthStart && (a.isCompleted || a.payment)
      )
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const lastMonthRevenue = appointments
      .filter(
        (a) =>
          a.date >= lastMonthStart &&
          a.date < lastMonthEnd &&
          (a.isCompleted || a.payment)
      )
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const revenueGrowth =
      lastMonthRevenue > 0
        ? Math.round(
            ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          )
        : thisMonthRevenue > 0
        ? 100
        : 0;

    const uniquePatients = [
      ...new Set(appointments.map((a) => a.userId?.toString()).filter(Boolean)),
    ];

    const videoCount = appointments.filter(
      (a) => a.appointmentType === "video"
    ).length;
    const inPersonCount = totalAppointments - videoCount;

    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthLabel = monthStart.toLocaleDateString("en-US", {
        month: "short",
      });

      const monthAppointments = appointments.filter(
        (a) => a.date >= monthStart.getTime() && a.date < monthEnd.getTime()
      ).length;
      const monthCompleted = appointments.filter(
        (a) =>
          a.date >= monthStart.getTime() &&
          a.date < monthEnd.getTime() &&
          a.isCompleted
      ).length;
      const monthRevenue = appointments
        .filter(
          (a) =>
            a.date >= monthStart.getTime() &&
            a.date < monthEnd.getTime() &&
            (a.isCompleted || a.payment)
        )
        .reduce((sum, a) => sum + (a.amount || 0), 0);

      monthlyTrend.push({
        month: monthLabel,
        appointments: monthAppointments,
        completed: monthCompleted,
        revenue: monthRevenue,
      });
    }

    const weeklyTrend = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekLabel = `Week ${4 - i}`;

      const weekAppointments = appointments.filter(
        (a) => a.date >= weekStart.getTime() && a.date < weekEnd.getTime()
      ).length;

      weeklyTrend.push({ week: weekLabel, appointments: weekAppointments });
    }

    const ratingsData = appointments.filter((a) => a.rating);
    const avgRating =
      ratingsData.length > 0
        ? (
            ratingsData.reduce((sum, a) => sum + a.rating, 0) /
            ratingsData.length
          ).toFixed(1)
        : null;

    return json({
      success: true,
      analytics: {
        stats: {
          totalAppointments,
          completedAppointments,
          cancelledAppointments,
          activeAppointments,
          completionRate,
          appointmentGrowth,
          thisMonthAppointments,
          totalPatients: uniquePatients.length,
        },
        revenue: {
          totalRevenue,
          thisMonthRevenue,
          revenueGrowth,
        },
        breakdown: {
          videoCount,
          inPersonCount,
        },
        monthlyTrend,
        weeklyTrend,
        avgRating,
      },
    });
  } catch (error) {
    console.log("Error in doctorAnalytics:", error);
    return bad((error as Error).message);
  }
}
