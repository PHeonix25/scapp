import { Apparatus, ClassType, Level } from '@prisma/client';

interface ClassInput {
  name: string;
  type: ClassType;
  instructor: {
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    clubworxId: string;
    apparatusLevel: Array<[Apparatus, Level]>;
  };
  students: Array<{
    name: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    clubworxId: string;
  }>;
  startDate: Date;
  endDate: Date;
  level: Level;
  apparatus: Apparatus;
}

const classes: ClassInput[] = [
  // Adult Classes - Beginner Level
  {
    name: 'Beginner Silks - Monday',
    type: ClassType.ADULT,
    instructor: {
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
    students: [
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
    ],
    startDate: new Date('2024-08-05T18:00:00'),
    endDate: new Date('2024-08-05T19:30:00'),
    apparatus: Apparatus.SILKS,
    level: Level.BEGINNER,
  },
  {
    name: 'Beginner Lyra - Wednesday',
    type: ClassType.ADULT,
    instructor: {
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
    students: [
      {
        name: 'Casey Kim',
        email: 'casey.k@example.com',
        phone: '0478901234',
        address: '987 Balance St, Canberra',
        gender: 'Non-binary',
        clubworxId: 'STU004',
      },
      {
        name: 'Alex Parker',
        email: 'alex.parker@example.com',
        phone: '0445678901',
        address: '123 Circus Ave, Darwin',
        gender: 'Male',
        clubworxId: 'STU005',
      },
    ],
    startDate: new Date('2024-08-07T19:00:00'),
    endDate: new Date('2024-08-07T20:30:00'),
    apparatus: Apparatus.LYRA,
    level: Level.BEGINNER,
  },

  // Adult Classes - Intermediate Level
  {
    name: 'Tech 1 Silks',
    type: ClassType.ADULT,
    instructor: {
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
    students: [
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
    ],
    startDate: new Date('2024-08-06T18:30:00'),
    endDate: new Date('2024-08-06T20:00:00'),
    apparatus: Apparatus.SILKS,
    level: Level.TECH_1,
  },
  {
    name: 'Tech 2 Hammock',
    type: ClassType.ADULT,
    instructor: {
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
    students: [
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
    ],
    startDate: new Date('2024-08-08T17:30:00'),
    endDate: new Date('2024-08-08T19:00:00'),
    apparatus: Apparatus.HAMMOCK,
    level: Level.TECH_2,
  },

  // Adult Classes - Advanced Level
  {
    name: 'Advanced Silks',
    type: ClassType.ADULT,
    instructor: {
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
    students: [
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
    ],
    startDate: new Date('2024-08-09T19:00:00'),
    endDate: new Date('2024-08-09T20:30:00'),
    apparatus: Apparatus.SILKS,
    level: Level.ADVANCED,
  },
  {
    name: 'Elite Trapeze',
    type: ClassType.ADULT,
    instructor: {
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
    students: [
      {
        name: 'Avery Garcia',
        email: 'avery.garcia@example.com',
        phone: '0489012346',
        address: '654 Trapeze Dr, Geelong',
        gender: 'Male',
        clubworxId: 'STU009',
      },
      {
        name: 'Jordan Brown',
        email: 'jordan.brown@example.com',
        phone: '0412345681',
        address: '159 Hammock Lane, Bendigo',
        gender: 'Female',
        clubworxId: 'STU011',
      },
    ],
    startDate: new Date('2024-08-10T18:00:00'),
    endDate: new Date('2024-08-10T19:30:00'),
    apparatus: Apparatus.TRAPEZE,
    level: Level.ELITE,
  },

  // Kids & Teens Classes
  {
    name: 'Kids Silks - Saturday Morning',
    type: ClassType.KIDS_TEENS,
    instructor: {
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
    students: [
      {
        name: 'Taylor Brown',
        email: 'taylor.b@example.com',
        phone: '0456789012',
        address: '321 Aerial Way, Perth',
        gender: 'Female',
        clubworxId: 'STU002',
      },
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
    ],
    startDate: new Date('2024-08-10T10:00:00'),
    endDate: new Date('2024-08-10T11:00:00'),
    apparatus: Apparatus.SILKS,
    level: Level.BEGINNER,
  },
  {
    name: 'Teen Lyra - Saturday Afternoon',
    type: ClassType.KIDS_TEENS,
    instructor: {
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
    students: [
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
    ],
    startDate: new Date('2024-08-10T14:00:00'),
    endDate: new Date('2024-08-10T15:30:00'),
    apparatus: Apparatus.LYRA,
    level: Level.TECH_1,
  },

  // Workshop Classes
  {
    name: 'Summer Holiday Circus Workshop',
    type: ClassType.SCHOOL_HOLIDAY_WORKSHOP,
    instructor: {
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
    students: [
      {
        name: 'Jamie Smith',
        email: 'jamie.s@example.com',
        phone: '0434567890',
        address: '789 Trapeze Lane, Brisbane',
        gender: 'Non-binary',
        clubworxId: 'STU001',
      },
      {
        name: 'Casey Kim',
        email: 'casey.k@example.com',
        phone: '0478901234',
        address: '987 Balance St, Canberra',
        gender: 'Non-binary',
        clubworxId: 'STU004',
      },
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
    ],
    startDate: new Date('2024-12-16T09:00:00'),
    endDate: new Date('2024-12-16T15:00:00'),
    apparatus: Apparatus.SILKS,
    level: Level.BEGINNER,
  },

  // Private Lessons
  {
    name: 'Private Silks Lesson - Advanced',
    type: ClassType.PRIVATE_LESSONS,
    instructor: {
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
    students: [
      {
        name: 'Taylor Wilson',
        email: 'taylor.wilson@example.com',
        phone: '0490123457',
        address: '987 Lyra St, Ballarat',
        gender: 'Non-binary',
        clubworxId: 'STU010',
      },
    ],
    startDate: new Date('2024-08-15T16:00:00'),
    endDate: new Date('2024-08-15T17:00:00'),
    apparatus: Apparatus.SILKS,
    level: Level.ADVANCED,
  },

  // Birthday Party
  {
    name: "Emma's 10th Birthday Circus Party",
    type: ClassType.BIRTHDAY_PARTY,
    instructor: {
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
    students: [
      {
        name: 'Taylor Brown',
        email: 'taylor.b@example.com',
        phone: '0456789012',
        address: '321 Aerial Way, Perth',
        gender: 'Female',
        clubworxId: 'STU002',
      },
      {
        name: 'Alex Parker',
        email: 'alex.parker@example.com',
        phone: '0445678901',
        address: '123 Circus Ave, Darwin',
        gender: 'Male',
        clubworxId: 'STU005',
      },
    ],
    startDate: new Date('2024-09-14T14:00:00'),
    endDate: new Date('2024-09-14T16:00:00'),
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
  },
];

export { classes };
