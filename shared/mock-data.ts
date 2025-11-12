import type { Vendor, ServiceHistory, AdminBooking, ServiceBundle, ServiceItem } from './types';
export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Precision Auto Works',
    address: '123 Mechanic Lane, Savannah, GA',
    description: 'Specializing in European models, Precision Auto Works offers top-tier diagnostics and mechanical repairs with factory-grade equipment. Our lead technician is a SCAD alumnus with a passion for performance tuning.',
    scadRate: 95,
    isAlumniOwned: true,
    isParentOwned: false,
    yearsInNetwork: 7,
    services: ['Mechanical', 'Diagnostics'],
    reviews: [
      { author: 'Jane D.', rating: 5, comment: 'Fast and reliable service! They fixed my BMW when no one else could.' },
      { author: 'John S.', rating: 4, comment: 'Good work, a bit pricey but you get what you pay for.' },
    ],
  },
  {
    id: 'v2',
    name: 'Savannah Bumper & Glass',
    address: '456 Body Shop Blvd, Savannah, GA',
    description: 'From minor dents to major collision repair, our family-owned shop (proud SCAD parent!) brings cars back to life. We use eco-friendly paints and offer a lifetime guarantee on all our work.',
    scadRate: 88,
    isAlumniOwned: false,
    isParentOwned: true,
    yearsInNetwork: 10,
    services: ['Body/Glass'],
    reviews: [
      { author: 'Emily R.', rating: 5, comment: 'My car looks brand new! The color match is perfect.' },
      { author: 'Chris B.', rating: 5, comment: 'Excellent customer service and flawless glass replacement.' },
    ],
  },
  {
    id: 'v3',
    name: 'Quick Lube Express',
    address: '789 Oil Change Ave, Savannah, GA',
    description: 'The fastest and friendliest quick service in town. We handle all routine maintenance, from oil changes to tire rotations, using only premium synthetic oils and top-quality parts. No appointment necessary.',
    scadRate: 92,
    isAlumniOwned: false,
    isParentOwned: false,
    yearsInNetwork: 5,
    services: ['Quick Service'],
    reviews: [
      { author: 'Mike T.', rating: 5, comment: 'In and out in 20 minutes, just as promised. Great value.' },
    ],
  },
  {
    id: 'v4',
    name: 'Total Car Care',
    address: '101 Repair Row, Savannah, GA',
    description: 'Your one-stop shop for everything your car needs. Co-owned by a SCAD alumnus and a SCAD parent, we combine technical expertise with a commitment to our community. We handle everything from oil changes to complex diagnostics.',
    scadRate: 90,
    isAlumniOwned: true,
    isParentOwned: true,
    yearsInNetwork: 6,
    services: ['Mechanical', 'Diagnostics', 'Quick Service'],
    reviews: [
        { author: 'Sarah K.', rating: 5, comment: 'They diagnosed a tricky issue other shops missed. Honest and transparent.' },
        { author: 'David L.', rating: 4, comment: 'Solid work, fair pricing. My go-to for all car issues.' },
    ],
  },
];
export const MOCK_SERVICE_HISTORY: ServiceHistory[] = [
    {
        id: 'h1',
        vendorName: 'Precision Auto Works',
        service: 'Brake Pad Replacement',
        date: new Date('2023-10-15'),
        cost: 450.00,
        warrantyExpires: new Date('2024-10-15'),
    },
    {
        id: 'h2',
        vendorName: 'Quick Lube Express',
        service: 'Full Synthetic Oil Change',
        date: new Date('2023-08-01'),
        cost: 89.99,
        warrantyExpires: null,
    },
    {
        id: 'h3',
        vendorName: 'Savannah Bumper & Glass',
        service: 'Windshield Chip Repair',
        date: new Date('2023-05-20'),
        cost: 120.00,
        warrantyExpires: new Date('2024-05-20'),
    },
    {
        id: 'h4',
        vendorName: 'Total Car Care',
        service: 'Check Engine Light Diagnostics',
        date: new Date('2023-03-10'),
        cost: 75.00,
        warrantyExpires: null,
    }
];
export const MOCK_REVIEW_QUEUE: AdminBooking[] = [
  {
    id: 'b-rev-1',
    customerName: 'Alice Johnson',
    vendorName: 'Precision Auto Works',
    date: new Date('2024-08-15'),
    time: '10:00 AM',
    status: 'Needs Review',
  },
  {
    id: 'b-rev-2',
    customerName: 'Bob Williams',
    vendorName: 'Total Car Care',
    date: new Date('2024-08-16'),
    time: '02:00 PM',
    status: 'Needs Review',
  },
  {
    id: 'b-rev-3',
    customerName: 'Charlie Brown',
    vendorName: 'Savannah Bumper & Glass',
    date: new Date('2024-08-17'),
    time: '11:00 AM',
    status: 'Needs Review',
  },
];
// Researched prices for Georgia, USA market
export const MOCK_VENDOR_SERVICES: Record<string, { bundles: ServiceBundle[], items: ServiceItem[] }> = {
  v1: { // Precision Auto Works (Mechanical Focus)
    bundles: [
      { id: 'b1-v1', name: 'Major Brake Service', description: 'Full replacement of front pads and rotors.', items: [
        { id: 's1-v1-b', name: 'Front Brake Pad Replacement', description: 'Premium ceramic pads.', price: 250.00, category: 'Mechanical' },
        { id: 's2-v1-b', name: 'Front Rotor Replacement', description: 'High-quality vented rotors.', price: 300.00, category: 'Mechanical' },
      ]},
    ],
    items: [
      { id: 's1-v1', name: 'Engine Diagnostic', description: 'Full computer diagnostic scan for check engine light.', price: 125.00, category: 'Diagnostics' },
      { id: 's2-v1', name: 'AC System Check & Recharge', description: 'Inspect for leaks and recharge refrigerant.', price: 180.00, category: 'Mechanical' },
      { id: 's3-v1', name: 'Full Synthetic Oil Change', description: 'Up to 5 quarts of premium oil and filter.', price: 95.00, category: 'Quick Service' },
      { id: 's4-v1', name: 'Transmission Fluid Exchange', description: 'Complete fluid replacement for automatic transmissions.', price: 220.00, category: 'Mechanical' },
    ],
  },
  v2: { // Savannah Bumper & Glass (Body/Glass Focus)
    bundles: [],
    items: [
      { id: 's1-v2', name: 'Small Dent Repair (PDR)', description: 'Per panel, up to 3 inches. Paintless.', price: 175.00, category: 'Body/Glass' },
      { id: 's2-v2', name: 'Windshield Chip Repair', description: 'Prevents cracks from spreading. Up to quarter size.', price: 110.00, category: 'Body/Glass' },
      { id: 's3-v2', name: 'Headlight Restoration', description: 'Restore clarity to foggy headlights (pair).', price: 130.00, category: 'Body/Glass' },
      { id: 's4-v2', name: 'Bumper Scuff Repair', description: 'Sand, fill, and paint minor bumper scuffs.', price: 350.00, category: 'Body/Glass' },
    ],
  },
  v3: { // Quick Lube Express (Quick Service Focus)
    bundles: [
      { id: 'b1-v3', name: 'The Works', description: 'Oil change, tire rotation, and fluid top-off.', items: [
        { id: 's1-v3-b', name: 'Full Synthetic Oil Change', description: 'Up to 5 quarts of premium oil.', price: 89.99, category: 'Quick Service' },
        { id: 's2-v3-b', name: 'Tire Rotation', description: 'Rotate and balance all four tires.', price: 45.00, category: 'Quick Service' },
      ]},
    ],
    items: [
      { id: 's1-v3', name: 'Wiper Blade Replacement', description: 'Premium all-weather blades (pair).', price: 55.00, category: 'Quick Service' },
      { id: 's2-v3', name: 'Engine Air Filter Replacement', description: 'Improves engine performance and efficiency.', price: 65.00, category: 'Quick Service' },
      { id: 's3-v3', name: 'Cabin Air Filter Replacement', description: 'Improves in-car air quality.', price: 70.00, category: 'Quick Service' },
    ],
  },
  v4: { // Total Car Care (All-rounder)
    bundles: [
      { id: 'b1-v4', name: 'Seasonal Prep Package', description: 'Get ready for the season ahead.', items: [
        { id: 's1-v4-b', name: 'AC System Check', description: 'Inspect and check pressures.', price: 90.00, category: 'Mechanical' },
        { id: 's2-v4-b', name: 'Coolant Flush', description: 'Replace old coolant.', price: 150.00, category: 'Mechanical' },
        { id: 's3-v4-b', name: 'Wiper Blade Replacement', description: 'Premium all-weather blades.', price: 55.00, category: 'Quick Service' },
      ]},
    ],
    items: [
      { id: 's1-v4', name: 'Full Synthetic Oil Change', description: 'Up to 5 quarts of premium oil.', price: 92.50, category: 'Quick Service' },
      { id: 's2-v4', name: 'Engine Diagnostic', description: 'Full computer diagnostic scan.', price: 120.00, category: 'Diagnostics' },
      { id: 's3-v4', name: 'Brake Inspection', description: 'Check pads, rotors, and fluid.', price: 50.00, category: 'Mechanical' },
      { id: 's4-v4', name: 'Wheel Alignment', description: 'Four-wheel alignment.', price: 130.00, category: 'Mechanical' },
      { id: 's5-v4', name: 'Small Dent Repair (PDR)', description: 'Per panel, up to 3 inches.', price: 180.00, category: 'Body/Glass' },
    ],
  },
};