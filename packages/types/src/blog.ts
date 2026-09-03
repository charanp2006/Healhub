export type BlogCategory =
  | "Health Tips"
  | "Nutrition"
  | "Mental Health"
  | "Fitness"
  | "Disease Awareness"
  | "Medical News"
  | "Hospital Updates"
  | "Other";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: BlogCategory;
  tags?: string[];
  author?: string;
  hospitalId?: string | { _id: string; name: string; city: string; image?: string } | null;
  doctorId?: string | { _id: string; name: string; speciality: string; image?: string } | null;
  isPublished?: boolean;
  publishedAt?: Date | null;
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
