export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  address?: {
    line1?: string;
    line2?: string;
  };
  gender?: string;
  dob?: string;
  phone?: string;
}

export interface Review {
  userId?: string;
  rating?: number;
  comment?: string;
  createdAt?: Date;
}

export interface ApiResponse<D = unknown> {
  success: boolean;
  message?: string;
  [key: string]: unknown;
  data?: D;
}
