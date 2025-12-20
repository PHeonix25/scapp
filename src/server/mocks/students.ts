interface StudentInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  clubworxId: string;
}

const students: StudentInput[] = [
  // Beginner Students
  {
    name: 'Jamie Smith',
    email: 'jamie.s@example.com',
    phone: '0434567890',
    address: '789 Trapeze Lane, Brisbane',
    gender: 'Non-binary',
    clubworxId: 'STU001',
  },
  {
    name: 'Taylor Brown',
    email: 'taylor.b@example.com',
    phone: '0456789012',
    address: '321 Aerial Way, Perth',
    gender: 'Female',
    clubworxId: 'STU002',
  },
  {
    name: 'Jordan Lee',
    email: 'jordan.l@example.com',
    phone: '0467890123',
    address: '654 Hoop Lane, Adelaide',
    gender: 'Male',
    clubworxId: 'STU003',
  },
  {
    name: 'Casey Kim',
    email: 'casey.k@example.com',
    phone: '0478901234',
    address: '987 Balance St, Canberra',
    gender: 'Non-binary',
    clubworxId: 'STU004',
  },

  // Intermediate Students
  {
    name: 'Alex Parker',
    email: 'alex.parker@example.com',
    phone: '0445678901',
    address: '123 Circus Ave, Darwin',
    gender: 'Male',
    clubworxId: 'STU005',
  },
  {
    name: 'Sam Davis',
    email: 'sam.davis@example.com',
    phone: '0456789013',
    address: '456 Acrobat St, Hobart',
    gender: 'Female',
    clubworxId: 'STU006',
  },
  {
    name: 'Riley Johnson',
    email: 'riley.johnson@example.com',
    phone: '0467890124',
    address: '789 Aerial Rd, Cairns',
    gender: 'Non-binary',
    clubworxId: 'STU007',
  },
  {
    name: 'Morgan White',
    email: 'morgan.white@example.com',
    phone: '0478901235',
    address: '321 Silk Ave, Townsville',
    gender: 'Female',
    clubworxId: 'STU008',
  },

  // Advanced Students
  {
    name: 'Avery Garcia',
    email: 'avery.garcia@example.com',
    phone: '0489012346',
    address: '654 Trapeze Dr, Geelong',
    gender: 'Male',
    clubworxId: 'STU009',
  },
  {
    name: 'Taylor Wilson',
    email: 'taylor.wilson@example.com',
    phone: '0490123457',
    address: '987 Lyra St, Ballarat',
    gender: 'Non-binary',
    clubworxId: 'STU010',
  },
  {
    name: 'Jordan Brown',
    email: 'jordan.brown@example.com',
    phone: '0412345681',
    address: '159 Hammock Lane, Bendigo',
    gender: 'Female',
    clubworxId: 'STU011',
  },
  {
    name: 'Casey Martinez',
    email: 'casey.martinez@example.com',
    phone: '0423456792',
    address: '753 Corde St, Launceston',
    gender: 'Male',
    clubworxId: 'STU012',
  },
];

export { students };
