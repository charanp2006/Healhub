import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* ----Left section---- */}
            <div>
                <div className='flex items-center gap-2 mb-5'>
                  <img className='w-10 h-10' src={assets.logo_icon} alt="Healhub" />
                  <span className='text-2xl font-bold text-gray-800'>Healhub</span>
                </div>
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>

            {/* ----center section---- */}
            <div>
                <p className='text-xl font-medium mb-5 text-gray-800'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            {/* ----right section---- */}
            <div>
                <p className='text-xl font-medium mb-5 text-gray-800'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-234-567-8910</li>
                    <li>User@gmail.com</li>
                </ul>
            </div>
        </div>

        {/* ------Copyright----- */}
        <div>
            <hr className='border-gray-300' />
            <p className='py-5 text-sm text-center text-gray-600'>Copyright 2024 @ Healhub - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer