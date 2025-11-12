import { IndexedEntity } from "./core-utils";
import type { Vendor } from "@shared/types";
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