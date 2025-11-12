import { IndexedEntity } from "./core-utils";
import type { Vendor, Booking } from "@shared/types";
import { MOCK_VENDORS } from "@shared/mock-data";
// VENDOR ENTITY: one DO instance per vendor
export class VendorEntity extends IndexedEntity<Vendor> {
  static readonly entityName = "vendor";
  static readonly indexName = "vendors";
  static readonly initialState: Vendor = {
    id: "",
    name: "",
    address: "",
    scadRate: 0,
    isAlumniOwned: false,
    isParentOwned: false,
    yearsInNetwork: 0,
    reviews: [],
    services: [],
  };
  static seedData = MOCK_VENDORS;
}
// BOOKING ENTITY: one DO instance per booking
export class BookingEntity extends IndexedEntity<Booking> {
  static readonly entityName = "booking";
  static readonly indexName = "bookings";
  static readonly initialState: Booking = {
    id: "",
    vendorId: "",
    vendorName: "",
    userId: "mock-user-id", // In a real app, this would come from auth
    date: new Date(),
    time: "",
    needsHumanReview: false,
    status: 'pending',
    services: [],
    adminNotes: "",
  };
}