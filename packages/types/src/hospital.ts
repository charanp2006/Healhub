import type { Review } from "./user";

export interface Hospital {
  _id: string;
  name: string;
  email?: string;
  password?: string;
  city: string;
  address?: {
    line1?: string;
    line2?: string;
  };
  location?: {
    type: string;
    coordinates: number[];
  };
  image?: string;
  about?: string;
  specialties?: string[];
  ratingAverage?: number;
  ratingCount?: number;
  reviews?: Review[];
  isRegistered: boolean;
  isAvailable?: boolean;
  totalBeds?: number;
  availableBeds?: number;
  createdAt?: Date;
  distanceKm?: number;
}
