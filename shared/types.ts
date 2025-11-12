export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Review {
  author: string;
  rating: number; // 1-5
  comment: string;
}
export interface Vendor {
  id: string;
  name: string;
  address: string;
  description?: string;
  scadRate: number; // 1-100
  isAlumniOwned: boolean;
  isParentOwned: boolean;
  yearsInNetwork: number;
  reviews: Review[];
  services: string[]; // e.g., ["Oil Change", "Brake Repair"]
}
export interface Booking {
  id: string;
  vendorId: string;
  vendorName: string;
  userId: string;
  date: Date;
  time: string;
  needsHumanReview: boolean;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
export interface CreateBookingPayload {
  vendorId: string;
  vendorName: string;
  date: string; // ISO string
  time: string;
  needsReview: boolean;
}
export interface ServiceHistory {
  id: string;
  vendorName: string;
  service: string;
  date: Date;
  cost: number;
  warrantyExpires: Date | null;
}
export interface AdminBooking {
  id: string;
  customerName: string;
  vendorName: string;
  date: Date;
  time: string;
  status: 'Needs Review' | 'Reviewed' | 'Action Required';
}