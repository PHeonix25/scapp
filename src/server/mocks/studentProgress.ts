import { SkillProgressStatus } from '@prisma/client';

interface StudentProgressInput {
  studentClubworxId: string;
  skillId: string;
  status: SkillProgressStatus;
  notes?: string;
  reason?: string;
  assessedBy?: string; // Instructor name
  assessedAt?: Date;
}

export const studentProgress: StudentProgressInput[] = [
  // Jamie Smith (STU001) - Beginner level progress
  {
    studentClubworxId: 'STU001',
    skillId: 'skill-1', // Basic Climb
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good technique, needs to work on speed',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-12T18:30:00'),
  },
  {
    studentClubworxId: 'STU001',
    skillId: 'skill-2', // Foot Lock
    status: SkillProgressStatus.MASTERED,
    notes: 'Excellent foot position and security',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-12T18:30:00'),
  },
  {
    studentClubworxId: 'STU001',
    skillId: 'skill-3', // Straight Line
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Working on extension and line',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-19T18:30:00'),
  },
  {
    studentClubworxId: 'STU001',
    skillId: 'skill-31', // Forward Roll
    status: SkillProgressStatus.MASTERED,
    notes: 'Perfect technique',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-05T18:30:00'),
  },

  // Taylor Brown (STU002) - Progressing well
  {
    studentClubworxId: 'STU002',
    skillId: 'skill-1', // Basic Climb
    status: SkillProgressStatus.MASTERED,
    notes: 'Strong and efficient climbing',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-12T18:30:00'),
  },
  {
    studentClubworxId: 'STU002',
    skillId: 'skill-2', // Foot Lock
    status: SkillProgressStatus.MASTERED,
    notes: 'Very secure foot lock',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-12T18:30:00'),
  },
  {
    studentClubworxId: 'STU002',
    skillId: 'skill-3', // Straight Line
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good line, working on holding longer',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-19T18:30:00'),
  },
  {
    studentClubworxId: 'STU002',
    skillId: 'skill-4', // Cocoon
    status: SkillProgressStatus.COMPETENT,
    notes: 'Comfortable in wrapped position',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-19T18:30:00'),
  },

  // Jordan Lee (STU003) - Needs more work
  {
    studentClubworxId: 'STU003',
    skillId: 'skill-1', // Basic Climb
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Struggling with coordination, needs more practice',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-19T18:30:00'),
  },
  {
    studentClubworxId: 'STU003',
    skillId: 'skill-2', // Foot Lock
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Foot position needs work',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-19T18:30:00'),
  },
  {
    studentClubworxId: 'STU003',
    skillId: 'skill-31', // Forward Roll
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good on ground skills',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-12T18:30:00'),
  },

  // Sam Davis (STU006) - Tech 1 level
  {
    studentClubworxId: 'STU006',
    skillId: 'skill-1', // Basic Climb
    status: SkillProgressStatus.MASTERED,
    notes: 'Excellent climbing technique',
    assessedBy: 'Avery Wilson',
    assessedAt: new Date('2024-08-06T19:00:00'),
  },
  {
    studentClubworxId: 'STU006',
    skillId: 'skill-5', // Russian Climb
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good technique, building efficiency',
    assessedBy: 'Avery Wilson',
    assessedAt: new Date('2024-08-13T19:00:00'),
  },
  {
    studentClubworxId: 'STU006',
    skillId: 'skill-6', // Back Balance
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Working on confidence in back balance',
    assessedBy: 'Avery Wilson',
    assessedAt: new Date('2024-08-13T19:00:00'),
  },
  {
    studentClubworxId: 'STU006',
    skillId: 'skill-34', // Handstand
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good handstand against wall',
    assessedBy: 'Avery Wilson',
    assessedAt: new Date('2024-08-06T19:00:00'),
  },

  // Riley Johnson (STU007) - Tech 1 level, progressing well
  {
    studentClubworxId: 'STU007',
    skillId: 'skill-5', // Russian Climb
    status: SkillProgressStatus.MASTERED,
    notes: 'Very efficient climbing technique',
    assessedBy: 'Avery Wilson',
    assessedAt: new Date('2024-08-13T19:00:00'),
  },
  {
    studentClubworxId: 'STU007',
    skillId: 'skill-6', // Back Balance
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good control and balance',
    assessedBy: 'Avery Wilson',
    assessedAt: new Date('2024-08-13T19:00:00'),
  },
  {
    studentClubworxId: 'STU007',
    skillId: 'skill-7', // Side Balance
    status: SkillProgressStatus.COMPETENT,
    notes: 'Nice extension in side balance',
    assessedBy: 'Avery Wilson',
    assessedAt: new Date('2024-08-13T19:00:00'),
  },

  // Jordan Brown (STU011) - Advanced level
  {
    studentClubworxId: 'STU011',
    skillId: 'skill-8', // Cross Back Straddle
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good inversion, working on straddle flexibility',
    assessedBy: 'Morgan Reed',
    assessedAt: new Date('2024-08-09T20:00:00'),
  },
  {
    studentClubworxId: 'STU011',
    skillId: 'skill-10', // Scorpion
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Needs more back flexibility',
    assessedBy: 'Morgan Reed',
    assessedAt: new Date('2024-08-16T20:00:00'),
  },
  {
    studentClubworxId: 'STU011',
    skillId: 'skill-11', // Jade Split
    status: SkillProgressStatus.COMPETENT,
    notes: 'Beautiful lines, very artistic',
    assessedBy: 'Morgan Reed',
    assessedAt: new Date('2024-08-09T20:00:00'),
  },
  {
    studentClubworxId: 'STU011',
    skillId: 'skill-42', // Needle Scale
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Working on balance and flexibility',
    assessedBy: 'Morgan Reed',
    assessedAt: new Date('2024-08-16T20:00:00'),
  },

  // Casey Martinez (STU012) - Advanced level
  {
    studentClubworxId: 'STU012',
    skillId: 'skill-8', // Cross Back Straddle
    status: SkillProgressStatus.MASTERED,
    notes: 'Excellent technique and control',
    assessedBy: 'Morgan Reed',
    assessedAt: new Date('2024-08-09T20:00:00'),
  },
  {
    studentClubworxId: 'STU012',
    skillId: 'skill-10', // Scorpion
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good scorpion, working on deeper backbend',
    assessedBy: 'Morgan Reed',
    assessedAt: new Date('2024-08-16T20:00:00'),
  },
  {
    studentClubworxId: 'STU012',
    skillId: 'skill-11', // Jade Split
    status: SkillProgressStatus.MASTERED,
    notes: 'Perfect jade split with beautiful extension',
    assessedBy: 'Morgan Reed',
    assessedAt: new Date('2024-08-09T20:00:00'),
  },

  // Avery Garcia (STU009) - Elite level student
  {
    studentClubworxId: 'STU009',
    skillId: 'skill-12', // Delilah Drop
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Working on timing and control for drop',
    assessedBy: 'Sarah Williams',
    assessedAt: new Date('2024-08-10T19:00:00'),
  },
  {
    studentClubworxId: 'STU009',
    skillId: 'skill-38', // Aerial Cartwheel
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good aerial, working on consistency',
    assessedBy: 'Sarah Williams',
    assessedAt: new Date('2024-08-10T19:00:00'),
  },
  {
    studentClubworxId: 'STU009',
    skillId: 'skill-39', // Back Tuck
    status: SkillProgressStatus.ATTEMPTED,
    notes: 'Needs more height and rotation',
    assessedBy: 'Sarah Williams',
    assessedAt: new Date('2024-08-10T19:00:00'),
  },

  // Lyra students progress
  {
    studentClubworxId: 'STU004', // Casey Kim
    skillId: 'skill-13', // Basic Mount
    status: SkillProgressStatus.MASTERED,
    notes: 'Confident mounting technique',
    assessedBy: 'Jordan Martinez',
    assessedAt: new Date('2024-08-07T20:00:00'),
  },
  {
    studentClubworxId: 'STU004',
    skillId: 'skill-14', // Sitting Position
    status: SkillProgressStatus.MASTERED,
    notes: 'Good posture and control',
    assessedBy: 'Jordan Martinez',
    assessedAt: new Date('2024-08-07T20:00:00'),
  },
  {
    studentClubworxId: 'STU004',
    skillId: 'skill-15', // Back Attitude
    status: SkillProgressStatus.COMPETENT,
    notes: 'Nice line, working on extension',
    assessedBy: 'Jordan Martinez',
    assessedAt: new Date('2024-08-14T20:00:00'),
  },

  {
    studentClubworxId: 'STU005', // Alex Parker
    skillId: 'skill-13', // Basic Mount
    status: SkillProgressStatus.COMPETENT,
    notes: 'Getting more confident with mounting',
    assessedBy: 'Jordan Martinez',
    assessedAt: new Date('2024-08-14T20:00:00'),
  },
  {
    studentClubworxId: 'STU005',
    skillId: 'skill-14', // Sitting Position
    status: SkillProgressStatus.COMPETENT,
    notes: 'Good sitting position',
    assessedBy: 'Jordan Martinez',
    assessedAt: new Date('2024-08-14T20:00:00'),
  },

  // Some students with exceptions
  {
    studentClubworxId: 'STU003', // Jordan Lee
    skillId: 'skill-36', // Back Handspring
    status: SkillProgressStatus.EXCEPTED,
    notes: 'Student has wrist injury',
    reason: 'Medical - wrist injury preventing weight bearing',
    assessedBy: 'Casey Thompson',
    assessedAt: new Date('2024-08-19T18:30:00'),
  },
  {
    studentClubworxId: 'STU005', // Alex Parker
    skillId: 'skill-40', // Bridge
    status: SkillProgressStatus.EXCEPTED,
    notes: 'Student has back flexibility limitations',
    reason: 'Physical limitation - limited back flexibility',
    assessedBy: 'Jordan Martinez',
    assessedAt: new Date('2024-08-14T20:00:00'),
  },
];
