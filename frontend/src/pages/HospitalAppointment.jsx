import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const HospitalAppointment = () => {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const { hospitals, clinics, doctors, currencySymbol } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [facility, setFacility] = useState(null);
  const [facilityDoctors, setFacilityDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  useEffect(() => {
    // Find facility (hospital or clinic)
    const foundHospital = hospitals.find(h => h._id === facilityId);
    const foundClinic = clinics.find(c => c._id === facilityId);
    
    if (foundHospital) {
      setFacility({ ...foundHospital, facilityType: 'hospital' });
      // Find doctors in this hospital
      const hospitalDoctors = doctors.filter(doc => doc.hospitalId === facilityId);
      setFacilityDoctors(hospitalDoctors);
    } else if (foundClinic) {
      setFacility({ ...foundClinic, facilityType: 'clinic' });
      // Find doctors in this clinic
      const clinicDoctors = doctors.filter(doc => doc.clinicId === facilityId);
      setFacilityDoctors(clinicDoctors);
    }
  }, [facilityId, hospitals, clinics, doctors]);

  const getAvailableSlots = async (doctor) => {
    setDocSlots([]);
    let today = new Date();
    
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => ([...prev, timeSlots]));
    }
  };

  useEffect(() => {
    if (selectedDoctor) {
      getAvailableSlots(selectedDoctor);
    }
  }, [selectedDoctor]);

  if (!facility) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
          <p className='text-gray-600'>Facility not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Facility Details */}
      <div className='flex flex-col sm:flex-row gap-4 mb-8'>
        <div className='bg-gray-200 w-full sm:max-w-72 h-48 rounded-lg flex items-center justify-center'>
          <span className='text-6xl'>{facility.facilityType === 'hospital' ? '🏥' : '🏥'}</span>
        </div>

        <div className='flex-1 border border-gray-300 rounded-lg p-8 py-7 bg-white'>
          <h2 className='text-3xl font-medium text-gray-700 mb-2'>
            {facility.name}
          </h2>
          <p className='text-gray-600 mb-4'>{facility.type}</p>
          
          <div className='mb-4'>
            <p className='text-sm font-medium text-gray-800 mb-1'>Address:</p>
            <p className='text-sm text-gray-600'>{facility.address.line1}</p>
            <p className='text-sm text-gray-600'>{facility.address.line2}</p>
          </div>
          
          {facility.phone && (
            <p className='text-sm text-gray-600 mb-2'>
              📞 {facility.phone}
            </p>
          )}
          
          {facility.rating && (
            <div className='flex items-center gap-1 text-sm text-gray-600'>
              <span>⭐</span>
              <span>{facility.rating}</span>
              {facility.reviewCount && (
                <span className='text-gray-500'>({facility.reviewCount} reviews)</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Doctors List */}
      {!selectedDoctor ? (
        <div>
            <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
            Available Doctors at {facility.name}
          </h3>
          {facilityDoctors.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {facilityDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className='border border-gray-300 rounded-lg p-4 bg-white cursor-pointer hover:shadow-lg transition-shadow'
                >
                  <img className='w-full h-48 object-cover rounded-lg mb-3' src={doctor.image} alt={doctor.name} />
                    <h4 className='text-lg font-semibold text-gray-800 mb-1'>
                    {doctor.name}
                  </h4>
                  <p className='text-sm text-gray-600 mb-2'>{doctor.speciality}</p>
                  <p className='text-sm text-gray-600 mb-2'>{doctor.degree}</p>
                  <p className='text-sm font-medium text-gray-800'>
                    Fee: {currencySymbol}{doctor.fees}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8 text-gray-600'>
              No doctors available at this facility.
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Doctor Details and Booking */}
          <button
            onClick={() => setSelectedDoctor(null)}
            className='mb-4 text-primary hover:underline'
          >
            ← Back to Doctors List
          </button>

          <div className='flex flex-col sm:flex-row gap-4 mb-8'>
            <div>
                <img className='bg-gray-200 w-full sm:max-w-72 rounded-lg' src={selectedDoctor.image} alt="" />
            </div>

            <div className='flex-1 border border-gray-300 rounded-lg p-8 py-7 bg-white'>
              <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                {selectedDoctor.name}
                <img className='w-5' src={assets.verified_icon} alt="" />
              </p>
                <div className='flex items-center gap-2 mt-1 text-gray-600'>
                <p>{selectedDoctor.degree} - {selectedDoctor.speciality}</p>
                <button className='py-0.5 px-2 border text-xs rounded-full'>
                  {selectedDoctor.experience}
                </button>
              </div>

              <div>
                <p className='flex items-center gap-1 text-sm font-medium text-gray-800 mt-3'>
                  About <img className='w-3' src={assets.info_icon} alt="" />
                </p>
                <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                  {selectedDoctor.about}
                </p>
              </div>
              <p className='text-gray-600 font-medium mt-4'>
                Appointment fee: <span className='text-gray-800'>
                  {currencySymbol}{selectedDoctor.fees}
                </span>
              </p>
            </div>
          </div>

          {/* Booking Slots */}
          <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-800'>
            <p>Booking slots</p>

            <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
              {docSlots.length && docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? 'bg-primary text-white'
                      : 'border border-gray-300'
                  }`}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
            </div>

            <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
              {docSlots.length && docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? 'bg-primary text-white'
                      : 'text-gray-600 border border-gray-300'
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
            </div>
            <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer hover:bg-primary/90 transition-colors'>
              Book an appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalAppointment;
