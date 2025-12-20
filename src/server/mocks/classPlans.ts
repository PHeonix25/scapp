interface ClassPlanInput {
  title: string;
  description?: string;
  date: Date;
  weekOfYear: number;
  duration: number; // in minutes
  classId: string; // Will be resolved during seeding
  skillIds: string[]; // Skill IDs to include in this plan
  notes?: string;
}

export const classPlans: ClassPlanInput[] = [
  // Beginner Silks Class Plans
  {
    title: 'Introduction to Silks - Week 1',
    description: 'First class focusing on safety and basic positions',
    date: new Date('2024-08-05T18:00:00'),
    weekOfYear: 1,
    duration: 90,
    classId: 'beginner-silks-monday', // Will be mapped to actual class
    skillIds: ['skill-1', 'skill-2', 'skill-31', 'skill-32'], // Basic Climb, Foot Lock, Forward Roll, Backward Roll
    notes:
      'Focus on safety briefing and basic movements. Take time with each student.',
  },
  {
    title: 'Building Foundation - Week 2',
    description: 'Reinforcing basic skills and adding poses',
    date: new Date('2024-08-12T18:00:00'),
    weekOfYear: 2,
    duration: 90,
    classId: 'beginner-silks-monday',
    skillIds: ['skill-1', 'skill-2', 'skill-3', 'skill-4', 'skill-33'], // Basic Climb, Foot Lock, Straight Line, Cocoon, Cartwheel
    notes:
      'Students should be more comfortable with climbing. Introduce first poses.',
  },
  {
    title: 'Expanding Movement - Week 3',
    description: 'Adding ground skills and flexibility',
    date: new Date('2024-08-19T18:00:00'),
    weekOfYear: 3,
    duration: 90,
    classId: 'beginner-silks-monday',
    skillIds: ['skill-3', 'skill-4', 'skill-40', 'skill-41'], // Straight Line, Cocoon, Bridge, Split
    notes: 'Incorporate flexibility work. Students should hold poses longer.',
  },

  // Tech 1 Silks Class Plans
  {
    title: 'Advancing Technique - Week 1',
    description: 'Introduction to more advanced climbing and balances',
    date: new Date('2024-08-06T18:30:00'),
    weekOfYear: 1,
    duration: 90,
    classId: 'tech1-silks',
    skillIds: ['skill-5', 'skill-6', 'skill-7', 'skill-34'], // Russian Climb, Back Balance, Side Balance, Handstand
    notes:
      'Students should have solid basic climb. Focus on control and balance.',
  },
  {
    title: 'Dynamic Movement - Week 2',
    description: 'Building strength and introducing transitions',
    date: new Date('2024-08-13T18:30:00'),
    weekOfYear: 2,
    duration: 90,
    classId: 'tech1-silks',
    skillIds: ['skill-6', 'skill-7', 'skill-25', 'skill-26'], // Back Balance, Side Balance, Inversion, Star Pose
    notes: 'Work on smooth transitions between poses. Build core strength.',
  },

  // Advanced Silks Class Plans
  {
    title: 'Advanced Combinations - Week 1',
    description: 'Complex sequences and advanced poses',
    date: new Date('2024-08-09T19:00:00'),
    weekOfYear: 1,
    duration: 90,
    classId: 'advanced-silks',
    skillIds: ['skill-8', 'skill-9', 'skill-10', 'skill-11'], // Cross Back Straddle, Gazelle, Scorpion, Jade Split
    notes:
      'Students should demonstrate strong inversions. Focus on artistry and flow.',
  },
  {
    title: 'Performance Preparation - Week 2',
    description: 'Preparing sequences for performance',
    date: new Date('2024-08-16T19:00:00'),
    weekOfYear: 2,
    duration: 90,
    classId: 'advanced-silks',
    skillIds: ['skill-10', 'skill-11', 'skill-42', 'skill-43'], // Scorpion, Jade Split, Needle Scale, Oversplit
    notes:
      'Work on performance quality and expression. Students create short sequences.',
  },

  // Beginner Lyra Class Plans
  {
    title: 'Lyra Basics - Week 1',
    description: 'Introduction to lyra and basic positions',
    date: new Date('2024-08-07T19:00:00'),
    weekOfYear: 1,
    duration: 90,
    classId: 'beginner-lyra-wednesday',
    skillIds: ['skill-13', 'skill-14', 'skill-15', 'skill-16'], // Basic Mount, Sitting Position, Back Attitude, Mermaid
    notes:
      'Focus on safe mounting and basic positions. Build confidence on apparatus.',
  },
  {
    title: 'Lyra Flow - Week 2',
    description: 'Connecting movements and building strength',
    date: new Date('2024-08-14T19:00:00'),
    weekOfYear: 2,
    duration: 90,
    classId: 'beginner-lyra-wednesday',
    skillIds: ['skill-15', 'skill-16', 'skill-17', 'skill-18'], // Back Attitude, Mermaid, Stag, Bird
    notes:
      'Work on transitions between poses. Students should feel comfortable moving on lyra.',
  },

  // Kids Class Plans
  {
    title: 'Circus Fun - Week 1',
    description: 'Introduction to circus through play',
    date: new Date('2024-08-10T10:00:00'),
    weekOfYear: 1,
    duration: 60,
    classId: 'kids-silks-saturday',
    skillIds: ['skill-1', 'skill-31', 'skill-32', 'skill-33'], // Basic Climb, Forward Roll, Backward Roll, Cartwheel
    notes: 'Keep it fun and playful. Use games to teach basic movements.',
  },
  {
    title: 'Animal Movements - Week 2',
    description: 'Learning through animal-themed movements',
    date: new Date('2024-08-17T10:00:00'),
    weekOfYear: 2,
    duration: 60,
    classId: 'kids-silks-saturday',
    skillIds: ['skill-2', 'skill-3', 'skill-4', 'skill-40'], // Foot Lock, Straight Line, Cocoon, Bridge
    notes: 'Use animal names for poses. Encourage creativity and expression.',
  },

  // Workshop Class Plan
  {
    title: 'Summer Circus Intensive',
    description: 'Full day introduction to multiple apparatus',
    date: new Date('2024-12-16T09:00:00'),
    weekOfYear: 51,
    duration: 360, // 6 hours
    classId: 'summer-workshop',
    skillIds: [
      'skill-1',
      'skill-2',
      'skill-3', // Silks basics
      'skill-13',
      'skill-14',
      'skill-15', // Lyra basics
      'skill-22',
      'skill-23',
      'skill-24', // Hammock basics
      'skill-31',
      'skill-32',
      'skill-33', // Ground skills
      'skill-40',
      'skill-41', // Flexibility
    ],
    notes:
      'Rotate through stations. Include breaks and snacks. End with mini performance.',
  },
];
