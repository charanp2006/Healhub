import React, { useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { logout } from '../services/authService'

const Navbar = () => {

    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
  
    const [showMenu, setShowMenu] = useState(false);
    const [dropdown,setDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            setDropdown(false);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

  return (
    <div className='flex justify-between items-center text-sm py-4 mb-5 border-b border-gray-400 bg-white'>
        <div onClick={()=>navigate('/')} className='flex items-center gap-1 cursor-pointer'>
          <img className='w-10 h-10' src={assets.logo_icon} alt="Healhub" />
            <div>
                <span className='text-3xl font-bold text-primary-dark'>Heal</span>
                <span className='text-3xl font-bold text-[#179E8D]'>hub</span>
            </div>
        </div>
        <ul className='md:flex items-start gap-5 font-medium hidden'>
            <NavLink to='/'>
                <li className='py-1 text-gray-800'>Home</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            {/* <NavLink to='/doctors'>
                <li className='py-1 text-gray-800'>All Doctors</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink> */}
            <NavLink to='/about'>
                <li className='py-1 text-gray-800'>About</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1 text-gray-800'>Contact</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/hospitals'>
                <li className='py-1 text-gray-800'>Search Hospitals</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {user
            ? <div onClick={()=>setDropdown(prev=>!prev)} className='flex items-center gap-2 cursor-pointer relative'>
                <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
                <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 bg-white ${dropdown ? 'block' : 'hidden'}`}>
                    <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                        <p onClick={()=>{navigate('/my-profile'); setDropdown(false);}} className='hover:text-black cursor-pointer'>My Profile</p>
                        <p onClick={()=>{navigate('/my-appointments'); setDropdown(false);}} className='hover:text-black cursor-pointer'>My Appointments</p>
                        <p onClick={handleLogout} className='hover:text-black cursor-pointer'>Logout</p>
                    </div>
                </div>
              </div>
            : <button onClick={()=>navigate('/login')} className='bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-full font-light hidden md:block transition-colors duration-200'>Create Account</button>
            }
            <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
            {/* ------- Mobile menu ------- */}
              <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
                    <div className='flex items-center gap-2'>
                      <img className='w-8 h-8' src={assets.logo_icon} alt="Healhub" />
                      <span className='text-xl font-bold text-gray-800'>Healhub</span>
                    </div>
                    <img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={()=>setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block text-gray-800'>Home</p></NavLink>
                    {/* <NavLink onClick={()=>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block text-gray-800'>All Doctors</p></NavLink> */}
                    <NavLink onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block text-gray-800'>About</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block text-gray-800'>Contact</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/hospitals'><p className='px-4 py-2 rounded inline-block text-gray-800'>Search Hospitals</p></NavLink>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Navbar