// @ts-nocheck
"use client";
import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "@/src/context/DoctorContext";
import { AppContext } from "@/src/context/AppContext";
import { assets } from "@/src/assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { CalendarCheck, CalendarMinus, CircleCheck, CircleDollarSign, Video, Users, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";

const DoctorAppointments = () => {
  const { backendURL, dToken, appointments, setAppointments, getDoctorAppointments, completeDoctorAppointment, cancelDoctorAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currencySymbol } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;
  const [loadingAction, setLoadingAction] = useState(null);

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormatFull = (slotDate) => {
    const parts = slotDate.split("_");
    return `${months[Number(parts[0])]} ${Number(parts[1])}, ${parts[2]}`;
  };

  useEffect(() => { if (dToken) getDoctorAppointments(); }, [dToken]);

  const handleAction = async (action, appointmentId) => {
    setLoadingAction(`${action}-${appointmentId}`);
    try {
      if (action === "complete") { await completeDoctorAppointment(appointmentId); }
      else if (action === "cancel") { await cancelDoctorAppointment(appointmentId); }
    } catch (error) { toast.error(error.message); }
    finally { setLoadingAction(null); }
  };

  const totalPages = Math.ceil(appointments?.length / appointmentsPerPage) || 1;
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const paginatedAppointments = appointments?.slice(startIndex, startIndex + appointmentsPerPage) || [];

  const typeIcon = (t) => t === "video" ? <Video size={12} className="text-blue-500" /> : <Users size={12} className="text-emerald-500" />;

  return (
    <div className="w-full max-w-4xl m-5">
      <p className="mb-3 text-lg font-medium text-gray-800">All Appointments</p>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_2fr_1.5fr] gap-1 py-3 px-6 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">#</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Patient</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Payment</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Age</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Date & Time</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Doctor Fee</p>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</p>
        </div>
        {paginatedAppointments.map((item, index) => (
          <div className="flex flex-wrap justify-between gap-2 sm:grid sm:grid-cols-[1fr_2fr_1fr_1fr_1fr_2fr_1.5fr] text-gray-500 py-3 px-6 border-b border-gray-50 hover:bg-gray-50/50 transition-colors items-center" key={index}>
            <p className="hidden sm:block text-gray-400 font-medium">{startIndex + index + 1}</p>
            <div className="flex items-center gap-3">
              <img className="w-8 h-8 rounded-full bg-gray-100 object-cover" src={item.userData?.image} alt="" />
              <div><p className="text-gray-800 font-medium">{item.userData?.name}</p><div className="flex items-center gap-1">{typeIcon(item.appointmentType)}<span className="text-xs capitalize">{item.appointmentType || "in-person"}</span></div></div>
            </div>
            <p className={`text-xs px-2 py-1 rounded-full text-center font-medium w-fit ${item.payment ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{item.payment ? "Paid" : "Unpaid"}</p>
            <p className="text-sm">{calculateAge(item.userData?.dob) || "N/A"}</p>
            <p className="text-sm">{slotDateFormat(item.slotDate) + ", " + item.slotTime}</p>
            <p className="font-semibold text-gray-700">{currencySymbol}{item.amount}</p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-emerald-500 text-xs font-medium">Completed</p>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => handleAction("cancel", item._id)} disabled={loadingAction === `cancel-${item._id}`} className="flex items-center gap-1 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer disabled:opacity-50">
                  <X size={14} />{loadingAction === `cancel-${item._id}` ? "..." : "Cancel"}
                </button>
                <button onClick={() => handleAction("complete", item._id)} disabled={loadingAction === `complete-${item._id}`} className="flex items-center gap-1 text-sm text-white bg-emerald-500 px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-all cursor-pointer disabled:opacity-50">
                  <CircleCheck size={14} />{loadingAction === `complete-${item._id}` ? "..." : "Complete"}
                </button>
              </div>
            )}
          </div>
        ))}
        {paginatedAppointments.length === 0 && (<div className="py-12 text-center text-gray-400"><CalendarCheck size={32} className="mx-auto mb-3 opacity-40" /><p>No appointments found</p></div>)}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-full disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-colors"><ChevronLeft size={14} />Prev</button>
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-full disabled:opacity-40 cursor-pointer hover:bg-gray-50 transition-colors">Next<ChevronRight size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
