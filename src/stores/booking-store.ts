import { create } from 'zustand';
import type { Vendor, ServiceItem } from '@shared/types';
interface BookingDetails {
  vendor: Vendor;
  date: Date;
  time: string;
  needsReview: boolean;
  services: ServiceItem[];
}
interface BookingState {
  booking: BookingDetails | null;
  setBookingDetails: (details: BookingDetails) => void;
  clearBooking: () => void;
}
export const useBookingStore = create<BookingState>((set) => ({
  booking: null,
  setBookingDetails: (details) => set({ booking: details }),
  clearBooking: () => set({ booking: null }),
}));