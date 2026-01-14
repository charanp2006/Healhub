import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Hospitals from './pages/Hospitals'
import HospitalAppointment from './pages/HospitalAppointment'
import InvalidPage from './pages/InvalidPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%] min-h-screen bg-white dark:bg-background-dark transition-colors duration-300'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/hospitals' element={<Hospitals />} />
        <Route path='/hospitals/:category' element={<Hospitals />} />
        <Route path='/hospital-appointment/:facilityId' element={<HospitalAppointment />} />
        <Route path='*' element={<InvalidPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
