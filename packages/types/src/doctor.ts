import type { Review } from "./user";

export interface DoctorDaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface DoctorSchedule {
  monday: DoctorDaySchedule;
  tuesday: DoctorDaySchedule;
  wednesday: DoctorDaySchedule;
  thursday: DoctorDaySchedule;
  friday: DoctorDaySchedule;
  saturday: DoctorDaySchedule;
  sunday: DoctorDaySchedule;
}

export interface Doctor {
  _id: string;
  name: string;
  email?: string;
  password?: string;
  image: string;
  speciality: string;
  experience: number;
  degree: string;
  about: string;
  available: boolean;
  fees: number;
  address?: {
    line1?: string;
    line2?: string;
  };
  hospitalId: string | HospitalRef;
  date?: number;
  slots_booked?: Record<string, string[]>;
  reviews?: Review[];
  ratingAverage?: number;
  ratingCount?: number;
  schedule?: DoctorSchedule;
  blockedDates?: string[];
  slotDuration?: number;
}

export interface HospitalRef {
  _id: string;
  name: string;
  city: string;
  image?: string;
}
