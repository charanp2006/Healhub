// @ts-nocheck
"use client";

import React, { useContext, useEffect } from "react";
import { HospitalContext } from "@/src/context/HospitalContext";

const HospitalDoctorsList = () => {
  const { doctors, hToken, getHospitalDoctors } = useContext(HospitalContext);

  useEffect(() => {
    if (hToken) {
      getHospitalDoctors();
    }
  }, [hToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">Our Doctors</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-border-light rounded-xl overflow-hidden max-w-56 group cursor-pointer hover:-translate-y-5 transition-all duration-500"
          >
            <img
              className="bg-primary-soft group-hover:bg-primary transition-all duration-500"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-text-primaryLight text-lg font-medium">
                {item.name}
              </p>
              <p className="text-text-secondaryLight text-sm">
                {item.speciality}
              </p>

              <div className="flex items-center gap-1 text-sm mt-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.available ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                <p
                  className={
                    item.available ? "text-green-600" : "text-gray-500"
                  }
                >
                  {item.available ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalDoctorsList;
