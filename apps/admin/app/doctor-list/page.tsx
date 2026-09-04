// @ts-nocheck
"use client";
import React from 'react'
import { useContext, useEffect } from 'react';
import { AdminContext } from '@/src/context/AdminContext';
import { Star } from 'lucide-react';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() =>{
    if(aToken){
      getAllDoctors();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.map((item, index) => (
          <div key={index} className="border border-border-light rounded-xl overflow-hidden max-w-56 group cursor-pointer hover:-translate-y- 5 transition-all duration-500">
            <img className="bg-primary-soft group-hover:bg-primary transition-all duration-500" src={item.image} alt="" />
            <div className="p-4">
              <p className="text-text-primaryLight text-lg font-medium">{item.name}</p>
              <p className="text-text-secondaryLight text-sm">{item.speciality}</p>
              <div className='flex items-center gap-1 mt-2'>
                <Star size={16} className='fill-yellow-400 text-yellow-400' />
                <span className='text-sm font-medium text-gray-700'>{item.ratingAverage ? item.ratingAverage.toFixed(1) : '0.0'}</span>
                <span className='text-xs text-gray-500'>({item.ratingCount || 0})</span>
              </div>
              <div className="flex items-center gap-1 text-sm mt-2">
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} name="" id="" />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
