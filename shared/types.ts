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
  userId: string;
  service: string;
  slot: Date;
  needsHumanReview: boolean;
  trustFee: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
export interface ServiceHistory {
  id: string;
  vendorName: string;
  service: string;
  date: Date;
  cost: number;
  warrantyExpires: Date | null;
}