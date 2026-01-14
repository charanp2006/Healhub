import React, { useState } from 'react'
import { assets } from '../assets/assets';

const MyProfile = () => {

  const [userData, setUserData] = useState({
    name : "Your name",
    image : assets.profile_pic,
    email : "your@email.com",
    phone : "1234567890",
    address : {
      line1 : "123 Main St",
      line2 : "City, State, Zip"
    },
    gender : "male",
    dob : "20-01-2001",
    // bloodGroup : "O+",
  });

  const [isEdit,setIsEdit] = useState(false);

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

      <img className='w-36 rounded' src={userData.image} alt="" />
      {
        isEdit
        ? <input className='bg-gray-50 border-2 border-gray-200 rounded-sm px-2 text-3xl font-medium max-w-60 mt-4' type="text" value={userData.name} onChange={(e)=> setUserData((prev) => ({...prev,name:e.target.value}) )}/>
        : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
      }
      <hr className='bg-[#ADADAD] h-[1px] border-none'/>
      <div>
        <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
          <p className='font-medium'>Email id:</p>
          <p className='text-gray-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
            {
              isEdit
              ? <input className='bg-gray-50 border-2 border-gray-200 rounded-sm px-2' type="text" value={userData.phone} onChange={(e)=> setUserData((prev) => ({...prev,phone:e.target.value}) )}/>
              : <p className='text-gray-500'>{userData.phone}</p>
            }
          <p className='font-medium'>Address:</p>
          {
            isEdit
            ? <p>
              <input className='bg-gray-50 border-2 border-gray-200 rounded-sm px-2' value={userData.address.line1} onChange={(e)=> setUserData((prev) => ({...prev,address: {...prev.address, line1:e.target.value}}) )} type="text" />
              <br />
              <input className='bg-gray-50 border-2 border-gray-200 rounded-sm px-2' value={userData.address.line2} onChange={(e)=> setUserData((prev) => ({...prev,address: {...prev.address, line2:e.target.value}}) )} type="text" />
            </p>
            : <p className='text-gray-500'>{userData.address.line1} <br /> {userData.address.line2}</p>
          }
        </div>
      </div>
      <div>
        <p className='text-gray-600 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
          <p className='font-medium'>Gender:</p>
          {
            isEdit
            ? <select className='max-w-20 bg-gray-100 border-2 border-gray-200 rounded-sm ' onChange={(e)=> setUserData((prev) => ({...prev, gender:e.target.value}) )} value={userData.gender}>
              <option value="not selected">not selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            : <p className='text-gray-500'>{userData.gender}</p>
          }
          <p className='font-medium'>DOB:</p>
          {
            isEdit
            ? <input className='max-w-30 bg-gray-100 border-2 border-gray-200 rounded-sm' type="date" onChange={(e)=> setUserData((prev) => ({...prev, dob:e.target.value}) )} value={userData.dob}/>
            : <p className='text-gray-500'>{userData.dob}</p>
          }
        </div>
      </div>

      <div className='mt-10'>
        {
          isEdit
          ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=> setIsEdit(false)}>Save</button>
          : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=> setIsEdit(true)}>Edit</button>
        }
      </div>
      
    </div>
  )
}

export default MyProfile
