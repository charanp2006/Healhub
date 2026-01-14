import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
// Icon is in public folder, will be referenced directly
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import logo_icon from './logo_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    icon: '/icon.svg',
    logo_icon,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Richard James',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        hospitalId: 'hosp1',
        clinicId: null
    },
    {
        _id: 'doc2',
        name: 'Dr. Emily Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        hospitalId: 'hosp4',
        clinicId: 'clin1'
    },
    {
        _id: 'doc3',
        name: 'Dr. Sarah Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        hospitalId: 'hosp2',
        clinicId: 'clin2'
    },
    {
        _id: 'doc4',
        name: 'Dr. Christopher Lee',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        hospitalId: 'hosp3',
        clinicId: 'clin3'
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        hospitalId: 'hosp1',
        clinicId: null
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]

// Mock data for hospitals
export const hospitals = [
    {
        _id: 'hosp1',
        name: 'City General Hospital',
        type: 'General Hospital',
        rating: 4.5,
        reviewCount: 1250,
        address: {
            line1: '123 Medical Center Dr',
            line2: 'Richmond Circle, London'
        },
        phone: '+1 (555) 123-4567',
        latitude: 12.9716,
        longitude: 77.5946,
        beds: 350,
        departments: ['Cardiology', 'Emergency Medicine', 'Surgery', 'Internal Medicine', 'Radiology'],
        facilities: ['24/7 Emergency', 'ICU', 'Operating Theaters', 'MRI', 'CT Scan', 'X-Ray', 'Pharmacy'],
        about: 'City General Hospital has been serving the community for over 35 years, providing comprehensive medical care with state-of-the-art facilities.'
    },
    {
        _id: 'hosp2',
        name: 'Metropolitan Medical Center',
        type: 'Medical Center',
        rating: 4.7,
        reviewCount: 890,
        address: {
            line1: '456 Health Plaza',
            line2: 'Midtown, London'
        },
        phone: '+1 (555) 987-6543',
        latitude: 12.9750,
        longitude: 77.6000,
        beds: 280,
        departments: ['Dermatology', 'Ophthalmology', 'ENT', 'Psychiatry', 'Rehabilitation', 'Oncology'],
        facilities: ['Outpatient Clinics', 'Diagnostic Center', 'Rehabilitation Center', 'Oncology Unit'],
        about: 'Metropolitan Medical Center specializes in outpatient care and specialized medical services.'
    },
    {
        _id: 'hosp3',
        name: 'Children\'s Healthcare Center',
        type: 'Pediatric Hospital',
        rating: 4.8,
        reviewCount: 567,
        address: {
            line1: '789 Kids Care Ave',
            line2: 'Family District, London'
        },
        phone: '+1 (555) 456-7890',
        latitude: 12.9800,
        longitude: 77.6050,
        beds: 120,
        departments: ['Pediatrics', 'Neonatal ICU', 'Pediatric Surgery', 'Child Psychology'],
        facilities: ['NICU', 'Pediatric ICU', 'Play Areas', 'Family Rooms', 'Pediatric ER'],
        about: 'Children\'s Healthcare Center is dedicated exclusively to pediatric care.'
    },
    {
        _id: 'hosp4',
        name: 'Richmond Medical Hospital',
        type: 'General Hospital',
        rating: 4.6,
        reviewCount: 432,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 234-5678',
        latitude: 12.9650,
        longitude: 77.5900,
        beds: 200,
        departments: ['General Medicine', 'Cardiology', 'Orthopedics', 'Gynecology'],
        facilities: ['Emergency', 'ICU', 'Laboratory', 'Pharmacy', 'Radiology'],
        about: 'A trusted healthcare provider in the Richmond area with modern facilities.'
    }
]

// Mock data for clinics
export const clinics = [
    {
        _id: 'clin1',
        name: 'Richmond Family Clinic',
        type: 'Family Clinic',
        rating: 4.4,
        reviewCount: 234,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 345-6789',
        latitude: 12.9720,
        longitude: 77.5950,
        specialties: ['General Medicine', 'Pediatrics', 'Family Medicine'],
        facilities: ['Consultation', 'Basic Lab Tests', 'Vaccination'],
        about: 'Comprehensive family healthcare services in a friendly environment.'
    },
    {
        _id: 'clin2',
        name: 'Downtown Health Clinic',
        type: 'Multi-Specialty Clinic',
        rating: 4.6,
        reviewCount: 189,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 456-7890',
        latitude: 12.9730,
        longitude: 77.5960,
        specialties: ['Dermatology', 'Gynecology', 'General Medicine'],
        facilities: ['Consultation', 'Minor Procedures', 'Lab Tests'],
        about: 'Multi-specialty clinic offering various healthcare services.'
    },
    {
        _id: 'clin3',
        name: 'Wellness Care Clinic',
        type: 'General Clinic',
        rating: 4.5,
        reviewCount: 156,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 567-8901',
        latitude: 12.9740,
        longitude: 77.5970,
        specialties: ['General Medicine', 'Preventive Care', 'Health Checkups'],
        facilities: ['Health Checkups', 'Consultation', 'Basic Diagnostics'],
        about: 'Focus on preventive healthcare and wellness programs.'
    },
    {
        _id: 'clin4',
        name: 'City Walk-In Clinic',
        type: 'Walk-In Clinic',
        rating: 4.3,
        reviewCount: 298,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 678-9012',
        latitude: 12.9750,
        longitude: 77.5980,
        specialties: ['Urgent Care', 'General Medicine', 'Minor Injuries'],
        facilities: ['Walk-In Service', 'Urgent Care', 'Basic Treatment'],
        about: 'Convenient walk-in clinic for immediate healthcare needs.'
    }
]

// Mock data for pharmacies (medical stores)
export const pharmacies = [
    {
        _id: 'pharm1',
        name: 'City Pharmacy',
        type: 'Pharmacy',
        rating: 4.7,
        reviewCount: 456,
        address: {
            line1: '123 Medical Center Dr',
            line2: 'Richmond Circle, London'
        },
        phone: '+1 (555) 789-0123',
        latitude: 12.9716,
        longitude: 77.5946,
        openHours: '8:00 AM - 10:00 PM',
        services: ['Prescription Drugs', 'Over-the-Counter', 'Health Supplements', 'Medical Equipment'],
        about: 'Full-service pharmacy with prescription and OTC medications.'
    },
    {
        _id: 'pharm2',
        name: '24/7 Medical Store',
        type: 'Pharmacy',
        rating: 4.5,
        reviewCount: 389,
        address: {
            line1: '456 Health Plaza',
            line2: 'Midtown, London'
        },
        phone: '+1 (555) 890-1234',
        latitude: 12.9750,
        longitude: 77.6000,
        openHours: '24 Hours',
        services: ['Prescription Drugs', 'Emergency Medications', 'Health Products', 'Home Delivery'],
        about: '24/7 pharmacy service for all your medical needs.'
    },
    {
        _id: 'pharm3',
        name: 'Richmond Drug Store',
        type: 'Pharmacy',
        rating: 4.6,
        reviewCount: 267,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 901-2345',
        latitude: 12.9720,
        longitude: 77.5950,
        openHours: '9:00 AM - 9:00 PM',
        services: ['Prescription Drugs', 'OTC Medications', 'Baby Care Products', 'Personal Care'],
        about: 'Trusted neighborhood pharmacy with personalized service.'
    },
    {
        _id: 'pharm4',
        name: 'Health Plus Pharmacy',
        type: 'Pharmacy',
        rating: 4.4,
        reviewCount: 198,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 012-3456',
        latitude: 12.9730,
        longitude: 77.5960,
        openHours: '8:00 AM - 11:00 PM',
        services: ['Prescription Drugs', 'Health Supplements', 'Medical Devices', 'Consultation'],
        about: 'Comprehensive pharmacy with health consultation services.'
    },
    {
        _id: 'pharm5',
        name: 'Family Care Medical Store',
        type: 'Pharmacy',
        rating: 4.5,
        reviewCount: 312,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        phone: '+1 (555) 123-4567',
        latitude: 12.9740,
        longitude: 77.5970,
        openHours: '7:00 AM - 10:00 PM',
        services: ['Prescription Drugs', 'Family Medicine', 'Baby Products', 'Elderly Care Products'],
        about: 'Family-focused pharmacy with caring service.'
    }
]