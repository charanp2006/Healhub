 
// Seed script: creates dummy demo accounts so all HealHub apps can be logged
// into with known credentials.
//
//   Runner:        cd apps/api && npm run seed
//   Dummy users:   see DEMO_* constants at the bottom / docs in .env.example
//
// Nothing here is required by the app at runtime; this is developer tooling.

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import userModel from "../lib/models/userModel.js";
import hospitalModel from "../lib/models/hospitalModel.js";
import doctorModel from "../lib/models/doctorModel.js";

const MONGODB_URI = `${
  process.env.MONGODB_URI || "mongodb://localhost:27017"
}/healhub`;

// ---------------------------------------------------------------------------
// Demo credentials. Keep these in sync with the NEXT_PUBLIC_DEMO_* / USER_*
// values in apps/web, apps/hospital and apps/admin .env.example files.
// ---------------------------------------------------------------------------
const DEMO = {
  user: {
    name: "Demo User",
    email: "demo@healhub.com",
    password: "Demo@123",
    phone: "9012345678",
    gender: "Male",
    dob: "01/01/1995",
  },
  hospital: {
    name: "Demo City Hospital",
    email: "hospital@healhub.com",
    password: "Hospital@123",
    city: "Mumbai",
    address: { line1: "12 MG Road", line2: "Andheri West" },
    specialties: ["Cardiology", "Orthopedics", "General Medicine"],
    totalBeds: 120,
    availableBeds: 84,
    image:
      "https://res.cloudinary.com/healhub/image/upload/v1/hospitals/demo-city-hospital.webp",
  },
  doctor: {
    name: "Dr. Demo Doctor",
    email: "doctor@healhub.com",
    password: "Doctor@123",
    image:
      "https://res.cloudinary.com/healhub/image/upload/v1/doctors/demo-doctor.webp",
    speciality: "Cardiologist",
    experience: 10,
    degree: "MBBS, MD (Cardiology)",
    about:
      "Board-certified cardiologist with a decade of experience in interventional cardiology.",
    fees: 500,
    address: { line1: "12 MG Road", line2: "Andheri West" },
  },
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Connected to MongoDB: ${MONGODB_URI}`);

  // --- Patient / User ------------------------------------------------------
  const hashedUser = await bcrypt.hash(DEMO.user.password, 10);
  await userModel.findOneAndUpdate(
    { email: DEMO.user.email },
    {
      $set: {
        name: DEMO.user.name,
        password: hashedUser,
        phone: DEMO.user.phone,
        gender: DEMO.user.gender,
        dob: DEMO.user.dob,
        address: { line1: "", line2: "" },
        image: "",
      },
    },
    { upsert: true, new: true }
  );
  console.log(`Seeded patient  : ${DEMO.user.email}`);

  // --- Hospital (registered so it can log in) ------------------------------
  const existingHospital = await hospitalModel
    .findOne({ email: DEMO.hospital.email })
    .select("_id location isRegistered");
  let hospitalId = existingHospital?._id;
  if (!hospitalId) {
    const hashedHospital = await bcrypt.hash(DEMO.hospital.password, 10);
    const hospital = await hospitalModel.create({
      ...DEMO.hospital,
      password: hashedHospital,
      location: { type: "Point", coordinates: [72.8777, 19.076] },
      isRegistered: true,
      isAvailable: true,
      ratingAverage: 4.6,
      ratingCount: 210,
    });
    hospitalId = hospital._id;
    console.log(`Seeded hospital : ${DEMO.hospital.email}`);
  } else {
    // Ensure the demo hospital is registered even if it pre-existed.
    await hospitalModel.updateOne(
      { _id: hospitalId },
      { $set: { isRegistered: true } }
    );
    console.log(`Hospital exists : ${DEMO.hospital.email} (kept, marked registered)`);
  }

  // --- Doctor linked to the demo hospital ---------------------------------
  const existingDoctor = await doctorModel
    .findOne({ email: DEMO.doctor.email })
    .select("_id");
  if (!existingDoctor) {
    const hashedDoctor = await bcrypt.hash(DEMO.doctor.password, 10);
    await doctorModel.create({
      name: DEMO.doctor.name,
      email: DEMO.doctor.email,
      password: hashedDoctor,
      image: DEMO.doctor.image,
      speciality: DEMO.doctor.speciality,
      experience: DEMO.doctor.experience,
      degree: DEMO.doctor.degree,
      about: DEMO.doctor.about,
      fees: DEMO.doctor.fees,
      address: DEMO.doctor.address,
      hospitalId,
      date: Date.now(),
      slots_booked: {},
    });
    console.log(`Seeded doctor   : ${DEMO.doctor.email}`);
  } else {
    console.log(`Doctor exists    : ${DEMO.doctor.email} (kept)`);
  }

  // --- Admin (no DB record; driven by API env ADMIN_EMAIL / ADMIN_PW) -----
  console.log("Admin (NO record):");
  console.log(`  Admin email     : ${process.env.ADMIN_EMAIL || "admin@healhub.com (set ADMIN_EMAIL in apps/api/.env)"}`);
  console.log(`  Admin password  : ${process.env.ADMIN_PW || "Admin@123 (set ADMIN_PW in apps/api/.env)"}`);

  await mongoose.disconnect();
  console.log("\nSeed complete.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });