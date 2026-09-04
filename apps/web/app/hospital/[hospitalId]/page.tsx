// @ts-nocheck
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "@/src/context/AppContext";
import { assets } from "@/src/assets/assets";

const HospitalProfile = () => {
  const { hospitalId } = useParams();
  const router = useRouter();
  const { backendURL, token } = useContext(AppContext);

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);

  const fetchHospital = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/hospital/${hospitalId}`
      );
      if (data.success) {
        setHospital(data.hospital);
        setDoctors(data.doctors || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchRoomAvailability = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/bed/availability/${hospitalId}`
      );
      if (data.success) {
        setRoomCategories(data.categories);
      }
    } catch (error) {
      // silently fail – room data is supplementary
    }
  };

  useEffect(() => {
    fetchHospital();
    fetchRoomAvailability();
  }, [hospitalId]);

  const handleBooking = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return router.push("/login");
    }

    if (!hospital?.isRegistered) {
      return toast.error("Hospital/Clinic is not registered for bookings");
    }

    try {
      const { data } = await axios.post(
        `${backendURL}/api/hospital/validate-booking`,
        { hospitalId },
        { headers: { token } }
      );

      if (data.success) {
        router.push(`/doctors?hospitalId=${hospitalId}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!hospital) {
    return (
      <p className="text-text-secondaryLight">Loading hospital/clinic...</p>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary-soft w-full sm:max-w-72 rounded-lg"
            src={hospital.image || assets.header_img.src}
            alt=""
          />
        </div>

        <div className="flex-1 border border-border-light rounded-lg p-8 py-7 bg-background-cardLight mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-text-primaryLight">
            {hospital.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-text-secondaryLight">
            <p>{hospital.city}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              Rating {hospital.ratingAverage.toFixed(1)}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-text-primaryLight mt-3">
              About
            </p>
            <p className="text-sm text-text-secondaryLight max-w-[700px] mt-1">
              {hospital.about || "No description available."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {hospital.specialties?.map((item) => (
              <span
                key={item}
                className="px-3 py-1 border border-border-light rounded-full text-xs text-text-secondaryLight"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="text-text-secondaryLight font-medium mt-4">
            Beds available: {hospital.availableBeds} / {hospital.totalBeds}
          </p>

          {roomCategories.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-text-primaryLight mb-2">
                Room-wise availability
              </p>
              <div className="flex flex-wrap gap-3">
                {roomCategories.map((cat) => (
                  <div
                    key={cat._id}
                    className="border border-border-light rounded-lg px-4 py-2 text-sm"
                  >
                    <p className="font-medium text-text-primaryLight">
                      {cat.name}
                    </p>
                    <p className="text-text-secondaryLight">
                      {cat.availableBeds} / {cat.totalBeds} beds free
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className={`flex items-center gap-2 text-sm mt-4 ${hospital.isRegistered ? "text-green-600" : "text-gray-500"}`}
          >
            <span
              className={`w-2 h-2 ${hospital.isRegistered ? "bg-green-500" : "bg-gray-400"} rounded-full`}
            ></span>
            <p>{hospital.isRegistered ? "Registered" : "Not Registered"}</p>
          </div>

          <button
            onClick={handleBooking}
            disabled={!hospital.isRegistered}
            className={`text-sm font-light px-14 py-3 rounded-full my-6 w-full sm:w-auto cursor-pointer touch-none-outline ${hospital.isRegistered ? "bg-primary text-white" : "bg-primary-soft text-text-secondaryLight cursor-not-allowed"}`}
          >
            Book an appointment
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-text-primaryLight text-xl font-medium">
          Doctors at this hospital
        </h2>
        {doctors.length === 0 ? (
          <p className="text-text-secondaryLight mt-4">
            No doctors are listed for this hospital yet.
          </p>
        ) : (
          <div className="w-full grid grid-cols-2 md:grid-cols-auto gap-3 md:gap-4 gap-y-5 md:gap-y-6 mt-5">
            {doctors.map((item) => (
              <div
                onClick={() => router.push(`/appointment/${item._id}`)}
                key={item._id}
                className="border border-primary-soft bg-white rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              >
                <img className="bg-primary-soft w-full" src={item.image} alt="" />
                <div className="p-3 md:p-4">
                  <div
                    className={`flex items-center gap-2 text-xs md:text-sm text-center ${item.available ? "text-green-600" : "text-gray-500"}`}
                  >
                    <span
                      className={`w-2 h-2 ${item.available ? "bg-green-500" : "bg-gray-400"} rounded-full`}
                    ></span>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>
                  <p className="text-text-primaryLight text-sm md:text-lg font-medium">
                    {item.name}
                  </p>
                  <p className="text-text-secondaryLight text-xs md:text-sm truncate">
                    {item.speciality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalProfile;
