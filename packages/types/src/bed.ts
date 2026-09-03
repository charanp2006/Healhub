export interface RoomCategory {
  _id: string;
  hospitalId: string;
  name: string;
  totalBeds: number;
  availableBeds: number;
  dailyRate: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AllocationStatus = "admitted" | "discharged" | "transferred";

export interface BedAllocation {
  _id: string;
  hospitalId: string;
  roomCategoryId: string | Pick<RoomCategory, "_id" | "name">;
  patientId: string | { _id: string; name: string; email: string; image?: string };
  admissionDate: Date;
  dischargeDate?: Date | null;
  status: AllocationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
