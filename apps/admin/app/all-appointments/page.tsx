// @ts-nocheck
"use client";
import { useState, useCallback, useContext, useEffect } from 'react';
import { AdminContext } from '@/src/context/AdminContext';
import { AppContext } from '@/src/context/AppContext';
import { assets } from '@/src/assets/assets';
import { Search, Video, MapPin, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const AllAppointments = () => {
  const {aToken, appointments, getAllAppointments, cancelAppointment, doctors, getAllDoctors} = useContext(AdminContext);
  const {currencySymbol, calculateAge, slotDateFormat} = useContext(AppContext);

  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [prescriptionView, setPrescriptionView] = useState(null);

  const fetchAppointments = useCallback(async () => {
    const params = { page, limit: 15 };
    if (statusFilter) params.status = statusFilter;
    if (typeFilter) params.appointmentType = typeFilter;
    if (doctorFilter) params.docId = doctorFilter;
    if (search.trim()) params.search = search.trim();
    const result = await getAllAppointments(params);
    if (result) {
      setTotalPages(result.totalPages || 1);
      setTotal(result.total || 0);
    }
  }, [page, statusFilter, typeFilter, doctorFilter, search, aToken]);

  useEffect(()=>{
    if(aToken){
      fetchAppointments();
      getAllDoctors();
    }
  },[aToken, page, statusFilter, typeFilter, doctorFilter])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (aToken) {
        setPage(1);
        fetchAppointments();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const getStatusBadge = (appointment) => {
    if (appointment.cancelled) return <span className='text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium'>Cancelled</span>;
    if (appointment.isCompleted) return <span className='text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium'>Completed</span>;
    if (appointment.rescheduled) return <span className='text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium'>Rescheduled</span>;
    return <span className='text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium'>Active</span>;
  }

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments <span className='text-sm text-gray-500 font-normal'>({total})</span></p>

      <div className='flex flex-wrap items-center gap-3 mb-4'>
        <div className='relative'>
          <Search size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
          <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search patient...' className='pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary w-52' />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className='px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary cursor-pointer'>
          <option value=''>All Status</option>
          <option value='active'>Active</option>
          <option value='completed'>Completed</option>
          <option value='cancelled'>Cancelled</option>
        </select>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className='px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary cursor-pointer'>
          <option value=''>All Types</option>
          <option value='in-person'>In-Person</option>
          <option value='video'>Video Call</option>
        </select>
        <select value={doctorFilter} onChange={(e) => { setDoctorFilter(e.target.value); setPage(1); }} className='px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary cursor-pointer max-w-48'>
          <option value=''>All Doctors</option>
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>{doc.name}</option>
          ))}
        </select>
      </div>

      <div className='bg-white border rounded text-sm max-h-[72vh] min-h-[50vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b bg-gray-50 font-medium text-gray-600'>
          <p>#</p>
          <p>Patient</p>
          <p>Type</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Status</p>
        </div>
        
        {appointments.length === 0 ? (
              <p className='p-40 text-gray-400 text-xl text-center'>No appointments found</p>
          ) :
          (
          appointments.map((appointment, index) => (
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b items-center hover:bg-gray-50'>
            <p className='max-sm:hidden text-gray-400'>{(page - 1) * 15 + index + 1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full' src={appointment.userData.image} alt="" />
              <div>
                <p className='font-medium'>{appointment.userData.name}</p>
                {appointment.symptoms && <p className='text-xs text-gray-400 truncate max-w-30' title={appointment.symptoms}>{appointment.symptoms}</p>}
              </div>
            </div>
            <div>
              {appointment.appointmentType === 'video'
                ? <span className='text-xs flex items-center gap-1 text-blue-600'><Video size={12} /> Video</span>
                : <span className='text-xs flex items-center gap-1 text-green-600'><MapPin size={12} /> Visit</span>
              }
            </div>
            <p className='max-sm:hidden'>{calculateAge(appointment.userData.dob)}</p>
            <div>
              <p className='font-medium'>{slotDateFormat(appointment.slotDate)}</p>
              <p className='text-xs text-gray-500'>{appointment.slotTime}</p>
            </div>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-100' src={appointment.docData.image} alt="" />
              <div>
                <p className='font-medium'>{appointment.docData.name}</p>
                <p className='text-xs text-gray-500'>{appointment.docData.speciality}</p>
              </div>
            </div>
            <p>{currencySymbol}{appointment.amount}</p>
            <div className='flex items-center gap-1'>
              {getStatusBadge(appointment)}
              {appointment.prescription && (
                <button onClick={() => setPrescriptionView(appointment)} className='p-1 hover:bg-gray-100 rounded cursor-pointer' title='View prescription'>
                  <FileText size={14} className='text-primary' />
                </button>
              )}
              {!appointment.cancelled && !appointment.isCompleted && (
                <img
                  onClick={() => cancelAppointment(appointment._id)}
                  className="w-7 cursor-pointer"
                  src={assets.cancel_icon}
                  alt="Cancel"
                  title="Cancel appointment"
                />
              )}
            </div>
          </div>
        )))}
      </div>

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-4 mt-4'>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className='p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed'>
            <ChevronLeft size={18} />
          </button>
          <span className='text-sm text-gray-600'>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className='p-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed'>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {prescriptionView && (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl shadow-xl max-w-md w-full p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold flex items-center gap-2'><FileText size={20} className='text-primary' /> Prescription</h3>
              <button onClick={() => setPrescriptionView(null)} className='text-gray-400 hover:text-gray-600 text-xl cursor-pointer'>&times;</button>
            </div>
            <div className='space-y-3'>
              <div>
                <p className='text-xs text-gray-500'>Patient</p>
                <p className='font-medium'>{prescriptionView.userData.name}</p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Doctor</p>
                <p className='font-medium'>{prescriptionView.docData.name}</p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>Date</p>
                <p className='font-medium'>{slotDateFormat(prescriptionView.slotDate)}</p>
              </div>
              <div className='border-t pt-3'>
                <p className='text-xs text-gray-500 mb-1'>Prescription</p>
                <p className='text-sm whitespace-pre-wrap'>{prescriptionView.prescription}</p>
              </div>
              {prescriptionView.followUpDate && (
                <div className='p-3 bg-blue-50 rounded-lg'>
                  <p className='text-xs text-gray-500'>Follow-up Date</p>
                  <p className='font-medium text-primary'>{slotDateFormat(prescriptionView.followUpDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllAppointments
