import type { Vendor } from './types';
export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Precision Auto Works',
    address: '123 Mechanic Lane, Savannah, GA',
    scadRate: 95,
    isAlumniOwned: true,
    isParentOwned: false,
    yearsInNetwork: 7,
    services: ['Mechanical', 'Diagnostics'],
    reviews: [
      { author: 'Jane D.', rating: 5, comment: 'Fast and reliable service!' },
      { author: 'John S.', rating: 4, comment: 'Good work, a bit pricey.' },
    ],
  },
  {
    id: 'v2',
    name: 'Savannah Bumper & Glass',
    address: '456 Body Shop Blvd, Savannah, GA',
    scadRate: 88,
    isAlumniOwned: false,
    isParentOwned: true,
    yearsInNetwork: 10,
    services: ['Body/Glass'],
    reviews: [
      { author: 'Emily R.', rating: 5, comment: 'My car looks brand new!' },
    ],
  },
  {
    id: 'v3',
    name: 'Quick Lube Express',
    address: '789 Oil Change Ave, Savannah, GA',
    scadRate: 92,
    isAlumniOwned: false,
    isParentOwned: false,
    yearsInNetwork: 5,
    services: ['Quick Service'],
    reviews: [
      { author: 'Mike T.', rating: 5, comment: 'In and out in 20 minutes.' },
    ],
  },
  {
    id: 'v4',
    name: 'Total Car Care',
    address: '101 Repair Row, Savannah, GA',
    scadRate: 90,
    isAlumniOwned: true,
    isParentOwned: true,
    yearsInNetwork: 6,
    services: ['Mechanical', 'Diagnostics', 'Quick Service'],
    reviews: [
        { author: 'Sarah K.', rating: 5, comment: 'They diagnosed a tricky issue other shops missed.' },
        { author: 'David L.', rating: 4, comment: 'Solid work, fair pricing.' },
    ],
  },
];