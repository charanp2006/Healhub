// @ts-nocheck
"use client";

import React, { useContext, useEffect } from "react";
import { assets } from "@/src/assets/assets";
import { HospitalContext } from "@/src/context/HospitalContext";
import { AppContext } from "@/src/context/AppContext";
import { SkeletonDashboard } from "@healhub/ui";

const HospitalDashboard = () => {
  const { hToken, dashboardData, getHospitalDashboard } =
    useContext(HospitalContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (hToken) {
      getHospitalDashboard();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hToken]);

  if (!dashboardData) {
    return <div className="m-5"><SkeletonDashboard /></div>;
  }

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 p-4 bg-white min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.people_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashboardData.doctors}
              </p>
              <p className="text-gray-400">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-white min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashboardData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 p-4 border-b-2 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashboardData.latestAppointments.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">
                No appointments found
              </p>
            ) : (
              dashboardData.latestAppointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                >
                  <img
                    className="rounded-full bg-gray-200 w-10"
                    src={appointment.docData?.image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-semibold">
                      {appointment.docData?.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {slotDateFormat(appointment.slotDate)}
                    </p>
                  </div>
                  {appointment.cancelled ? (
                    <p className="text-red-500 font-medium">Cancelled</p>
                  ) : appointment.isCompleted ? (
                    <p className="text-green-500 font-medium">Completed</p>
                  ) : (
                    <p className="text-yellow-500 font-medium">Pending</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  );
};

export default HospitalDashboard;
