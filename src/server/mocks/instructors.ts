import { Apparatus, Level } from '@/generated/prisma';

interface InstructorInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  clubworxId: string;
  apparatusLevel: Array<[Apparatus, Level]>;
}

const instructors: InstructorInput[] = [
  // Senior Instructors (Elite level)
  {
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '0423456789',
    address: '456 Acrobat Ave, Melbourne',
    gender: 'Female',
    clubworxId: 'INST001',
    apparatusLevel: [
      [Apparatus.SILKS, Level.ELITE],
      [Apparatus.LYRA, Level.ELITE],
      [Apparatus.TRAPEZE, Level.ADVANCED],
    ],
  },
  {
    name: 'Morgan Reed',
    email: 'morgan.r@example.com',
    phone: '0489012345',
    address: '159 Juggler Rd, Gold Coast',
    gender: 'Non-binary',
    clubworxId: 'INST002',
    apparatusLevel: [
      [Apparatus.SILKS, Level.ADVANCED],
      [Apparatus.LYRA, Level.ELITE],
      [Apparatus.HAMMOCK, Level.ADVANCED],
    ],
  },
  {
    name: 'Riley Chen',
    email: 'riley.c@example.com',
    phone: '0490123456',
    address: '753 Trapeze Way, Newcastle',
    gender: 'Female',
    clubworxId: 'INST003',
    apparatusLevel: [
      [Apparatus.TRAPEZE, Level.ELITE],
      [Apparatus.HAMMOCK, Level.TECH_3],
      [Apparatus.CORDE_LISSE, Level.ADVANCED],
    ],
  },

  // Mid-level Instructors
  {
    name: 'Avery Wilson',
    email: 'avery.w@example.com',
    phone: '0412345670',
    address: '456 Aerial Dr, Wollongong',
    gender: 'Male',
    clubworxId: 'INST004',
    apparatusLevel: [
      [Apparatus.CORDE_LISSE, Level.TECH_2],
      [Apparatus.SILKS, Level.ADVANCED],
      [Apparatus.HAMMOCK, Level.TECH_3],
    ],
  },
  {
    name: 'Jordan Martinez',
    email: 'jordan.martinez@example.com',
    phone: '0498765432',
    address: '321 Silk St, Perth',
    gender: 'Non-binary',
    clubworxId: 'INST005',
    apparatusLevel: [
      [Apparatus.SILKS, Level.TECH_3],
      [Apparatus.LYRA, Level.ADVANCED],
      [Apparatus.TRAPEZE, Level.TECH_2],
    ],
  },
  {
    name: 'Casey Thompson',
    email: 'casey.thompson@example.com',
    phone: '0487654321',
    address: '654 Lyra Lane, Adelaide',
    gender: 'Female',
    clubworxId: 'INST006',
    apparatusLevel: [
      [Apparatus.LYRA, Level.TECH_3],
      [Apparatus.HAMMOCK, Level.ADVANCED],
      [Apparatus.SILKS, Level.TECH_2],
    ],
  },
];

export { instructors };
