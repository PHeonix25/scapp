import { Apparatus, Level } from '@prisma/client';

// Type for database representation of Skill
export interface DBSkill {
  id: string;
  name: string;
  core: boolean;
  apparatus: Apparatus;
  level: Level;
  taughtIn: string; // Comma-separated levels, e.g., "BEGINNER,INTERMEDIATE"
  applicableWeeks: number[]; // Array of week numbers when this skill should be taught
  notes: string;
  cues: string;
  parentId: string | null;
  children?: DBSkill[];
  siblings?: string[]; // Array of sibling skill IDs
}

// Type for application representation of Skill
export interface Skill extends Omit<DBSkill, 'taughtIn'> {
  taughtIn: Level[]; // Array of levels when working in the app
  applicableWeeks: number[]; // Array of week numbers when this skill should be taught
}

// Helper to convert between DB and app representations
export const toDBSkill = (skill: Skill): DBSkill => {
  const { taughtIn, ...rest } = skill;
  return {
    ...rest,
    taughtIn: Array.isArray(taughtIn) ? taughtIn.join(',') : taughtIn,
  };
};

export const fromDBSkill = (dbSkill: DBSkill): Skill => {
  const { taughtIn, ...rest } = dbSkill;
  return {
    ...rest,
    taughtIn:
      typeof taughtIn === 'string'
        ? (taughtIn.split(',') as Level[])
        : taughtIn,
  };
};

// Helper functions that work with the Skill type
export const getSkillById = (
  id: string,
  skills: Skill[] = mockSkills
): Skill | undefined => {
  const skill = skills.find(skill => skill.id === id);
  return skill ?? undefined;
};

export const getSkillChildren = (
  skillId: string,
  skills: Skill[] = mockSkills
): Skill[] => {
  return skills.filter(skill => skill.parentId === skillId).map(skill => skill);
};

export const getSkillSiblings = (
  skill: Skill,
  skills: Skill[] = mockSkills
): Skill[] => {
  if (!skill.siblings) return [];
  return skills.filter(s => skill.siblings?.includes(s.id)).map(skill => skill);
};

export const getSkillsByApparatus = (
  apparatus: Apparatus,
  skills: Skill[] = mockSkills
): Skill[] => {
  return skills
    .filter(skill => skill.apparatus === apparatus)
    .map(skill => skill);
};

// Helper function to generate a unique ID
const id = (num: number) => `skill-${num}`;

// Mock data using Skill type (with valid taughtIn)
export const mockSkills: Skill[] = [
  // ===== SILKS SKILLS =====

  // Beginner Silks - Foundation Skills
  {
    id: id(1),
    name: 'Basic Climb',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    applicableWeeks: [1, 2, 3, 4, 5, 6, 7, 8], // Taught throughout beginner course
    notes: 'Basic footlock climb - foundation of all silks work',
    cues: 'Feet in front, wrap and stand, keep silks tight',
    parentId: null,
    siblings: [id(2)],
  },
  {
    id: id(2),
    name: 'Foot Lock',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    applicableWeeks: [1, 2, 3, 4, 5, 6, 7, 8], // Fundamental skill taught throughout
    notes: 'Basic foot position for climbing and poses',
    cues: 'Top foot hooks, bottom foot secures',
    parentId: null,
    siblings: [id(1)],
  },
  {
    id: id(3),
    name: 'Straight Line',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    applicableWeeks: [2, 3, 4, 5], // Introduced after basic climbing
    notes: 'Basic pose showing line and extension',
    cues: 'Long spine, reach through crown of head',
    parentId: id(2),
    siblings: [id(4)],
  },
  {
    id: id(4),
    name: 'Cocoon',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Wrapped position for rest and transitions',
    cues: 'Wrap at hip level, secure with hands',
    parentId: id(2),
    siblings: [id(3)],
    applicableWeeks: [],
  },

  // Tech 1 Silks
  {
    id: id(5),
    name: 'Russian Climb',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1],
    notes: 'More efficient climbing technique',
    cues: 'Knee over knee, push down with arms',
    parentId: id(1),
    siblings: [],
    applicableWeeks: [],
  },
  {
    id: id(6),
    name: 'Back Balance',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1],
    notes: 'Balancing on back in foot lock',
    cues: 'Lean back slowly, arms out for balance',
    parentId: id(3),
    siblings: [id(7)],
    applicableWeeks: [],
  },
  {
    id: id(7),
    name: 'Side Balance',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1],
    notes: 'Balancing on side in foot lock',
    cues: 'Roll to side, extend free leg',
    parentId: id(3),
    siblings: [id(6)],
    applicableWeeks: [],
  },

  // Tech 2 Silks
  {
    id: id(8),
    name: 'Cross Back Straddle',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.TECH_2,
    taughtIn: [Level.TECH_2],
    notes: 'Inverted straddle with silk across back',
    cues: 'Invert, silk across back, open legs wide',
    parentId: id(6),
    siblings: [id(9)],
    applicableWeeks: [],
  },
  {
    id: id(9),
    name: 'Gazelle',
    core: true,
    apparatus: Apparatus.SILKS,
    level: Level.TECH_2,
    taughtIn: [Level.TECH_2],
    notes: 'Dynamic pose with one leg extended',
    cues: 'From foot lock, extend one leg forward',
    parentId: id(7),
    siblings: [id(8)],
    applicableWeeks: [],
  },

  // Advanced Silks
  {
    id: id(10),
    name: 'Scorpion',
    core: false,
    apparatus: Apparatus.SILKS,
    level: Level.ADVANCED,
    taughtIn: [Level.ADVANCED],
    applicableWeeks: [6, 7, 8, 9, 10], // Advanced skill introduced later in course
    notes: 'Backbend with foot to head',
    cues: 'Secure wrap, reach back foot to head',
    parentId: id(8),
    siblings: [id(11)],
  },
  {
    id: id(11),
    name: 'Jade Split',
    core: false,
    apparatus: Apparatus.SILKS,
    level: Level.ADVANCED,
    taughtIn: [Level.ADVANCED],
    applicableWeeks: [5, 6, 7, 8], // Introduced mid-course
    notes: 'Split position with silk support',
    cues: 'From straddle, extend one leg down',
    parentId: id(8),
    siblings: [id(10)],
  },

  // Elite Silks
  {
    id: id(12),
    name: 'Delilah Drop',
    core: false,
    apparatus: Apparatus.SILKS,
    level: Level.ELITE,
    taughtIn: [Level.ELITE],
    notes: 'Dynamic drop from inverted position',
    cues: 'Secure wrap, controlled release',
    parentId: id(10),
    siblings: [],
    applicableWeeks: [],
  },

  // ===== LYRA SKILLS =====

  // Beginner Lyra
  {
    id: id(13),
    name: 'Basic Mount',
    core: true,
    apparatus: Apparatus.LYRA,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Getting onto the lyra safely',
    cues: 'Step through, pull up with arms',
    parentId: null,
    siblings: [id(14)],
    applicableWeeks: [],
  },
  {
    id: id(14),
    name: 'Sitting Position',
    core: true,
    apparatus: Apparatus.LYRA,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Basic seated position on lyra',
    cues: 'Sit tall, hands on hoop for support',
    parentId: id(13),
    siblings: [id(15)],
    applicableWeeks: [],
  },
  {
    id: id(15),
    name: 'Back Attitude',
    core: true,
    apparatus: Apparatus.LYRA,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Leaning back with one leg extended',
    cues: 'Lean back, extend leg, point toe',
    parentId: id(14),
    siblings: [id(16)],
    applicableWeeks: [],
  },
  {
    id: id(16),
    name: 'Mermaid',
    core: true,
    apparatus: Apparatus.LYRA,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Side-lying position on lyra',
    cues: 'Lie on side, drape over hoop',
    parentId: id(14),
    siblings: [id(15)],
    applicableWeeks: [],
  },

  // Tech 1 Lyra
  {
    id: id(17),
    name: 'Stag',
    core: true,
    apparatus: Apparatus.LYRA,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1],
    notes: 'One leg bent, one extended',
    cues: 'Bend front leg, extend back leg',
    parentId: id(15),
    siblings: [id(18)],
    applicableWeeks: [],
  },
  {
    id: id(18),
    name: 'Bird',
    core: true,
    apparatus: Apparatus.LYRA,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1],
    notes: 'Balancing on stomach',
    cues: 'Balance on hips, arms and legs extended',
    parentId: id(16),
    siblings: [id(17)],
    applicableWeeks: [],
  },

  // ===== TRAPEZE SKILLS =====

  // Beginner Trapeze
  {
    id: id(19),
    name: 'Basic Hang',
    core: true,
    apparatus: Apparatus.TRAPEZE,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Hanging from trapeze bar',
    cues: 'Strong grip, shoulders engaged',
    parentId: null,
    siblings: [id(20)],
    applicableWeeks: [],
  },
  {
    id: id(20),
    name: 'Knee Hang',
    core: true,
    apparatus: Apparatus.TRAPEZE,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Hanging by knees from bar',
    cues: 'Hook knees over bar, release hands slowly',
    parentId: id(19),
    siblings: [id(21)],
    applicableWeeks: [],
  },
  {
    id: id(21),
    name: 'Backflip Dismount',
    core: true,
    apparatus: Apparatus.TRAPEZE,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Basic dismount with backward rotation',
    cues: 'Release and tuck knees to chest',
    parentId: id(20),
    siblings: [],
    applicableWeeks: [],
  },

  // ===== HAMMOCK SKILLS =====

  // Beginner Hammock
  {
    id: id(22),
    name: 'Basic Wrap',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Getting into the hammock',
    cues: 'Sit in fabric, wrap around body',
    parentId: null,
    siblings: [id(23)],
    applicableWeeks: [],
  },
  {
    id: id(23),
    name: 'Cocoon Pose',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Wrapped resting position',
    cues: 'Wrap fabric around body, relax',
    parentId: id(22),
    siblings: [id(24)],
    applicableWeeks: [],
  },
  {
    id: id(24),
    name: 'Forward Fold',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Folding forward in hammock',
    cues: 'Hinge at hips, let head hang',
    parentId: id(22),
    siblings: [id(23)],
    applicableWeeks: [],
  },

  // Tech 1 Hammock
  {
    id: id(25),
    name: 'Inversion',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1],
    notes: 'Going upside down in hammock',
    cues: 'Lean back, lift legs over head',
    parentId: id(24),
    siblings: [id(26)],
    applicableWeeks: [],
  },
  {
    id: id(26),
    name: 'Star Pose',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1],
    notes: 'Arms and legs extended wide',
    cues: 'Open arms and legs like a star',
    parentId: id(23),
    siblings: [id(25)],
    applicableWeeks: [],
  },

  // ===== CORDE LISSE SKILLS =====

  // Beginner Corde Lisse
  {
    id: id(27),
    name: 'Basic Climb - Rope',
    core: true,
    apparatus: Apparatus.CORDE_LISSE,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Climbing technique for rope',
    cues: 'Wrap rope around leg, step and pull',
    parentId: null,
    applicableWeeks: [],
    siblings: [id(28)],
  },
  {
    id: id(28),
    name: 'Rope Lock',
    core: true,
    apparatus: Apparatus.CORDE_LISSE,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Securing position on rope',
    cues: 'Wrap rope around foot and ankle',
    parentId: id(27),
    siblings: [],
    applicableWeeks: [],
  },

  // Tech 2 Corde Lisse
  {
    id: id(29),
    name: 'Crucifix',
    core: true,
    apparatus: Apparatus.CORDE_LISSE,
    level: Level.TECH_2,
    taughtIn: [Level.TECH_2],
    notes: 'Arms extended horizontally',
    cues: 'Rope behind back, arms out to sides',
    parentId: id(28),
    siblings: [id(30)],
    applicableWeeks: [],
  },
  {
    id: id(30),
    name: 'Attitude',
    core: true,
    apparatus: Apparatus.CORDE_LISSE,
    level: Level.TECH_2,
    taughtIn: [Level.TECH_2],
    notes: 'One leg bent, one extended',
    cues: 'Bend one leg, extend the other',
    parentId: id(28),
    siblings: [id(29)],
    applicableWeeks: [],
  },

  // ===== GROUND SKILLS (HAMMOCK) =====

  // Basic Ground Skills
  {
    id: id(31),
    name: 'Forward Roll',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Basic rolling technique on ground',
    cues: 'Chin to chest, push with hands, round back',
    parentId: null,
    siblings: [id(32), id(33)],
    applicableWeeks: [],
  },
  {
    id: id(32),
    name: 'Backward Roll',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Backward rolling technique',
    cues: 'Sit back, hands by ears, push over',
    parentId: null,
    siblings: [id(31), id(33)],
    applicableWeeks: [],
  },
  {
    id: id(33),
    name: 'Cartwheel',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER],
    notes: 'Basic cartwheel movement',
    cues: 'Reach, lunge, hand-hand-foot-foot',
    parentId: null,
    siblings: [id(31), id(32)],
    applicableWeeks: [],
  },

  // Intermediate Ground Skills
  {
    id: id(34),
    name: 'Handstand',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.TECH_1,
    taughtIn: [Level.TECH_1, Level.BEGINNER],
    notes: 'Basic handstand against wall or free',
    cues: 'Straight body, tight core, look at hands',
    parentId: id(33),
    siblings: [id(35)],
    applicableWeeks: [],
  },
  {
    id: id(35),
    name: 'Round Off',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.TECH_2,
    taughtIn: [Level.TECH_2, Level.TECH_1],
    notes: 'Powerful turning skill',
    cues: 'Run, hurdle, block with hands, snap feet together',
    parentId: id(33),
    siblings: [id(34)],
    applicableWeeks: [],
  },

  // Advanced Ground Skills
  {
    id: id(36),
    name: 'Back Handspring',
    core: false,
    apparatus: Apparatus.HAMMOCK,
    level: Level.ADVANCED,
    taughtIn: [Level.ADVANCED, Level.TECH_3],
    notes: 'Backward rotation with hand support',
    cues: 'Swing arms up, snap down, push through shoulders',
    parentId: id(34),
    siblings: [id(37)],
    applicableWeeks: [],
  },
  {
    id: id(37),
    name: 'Front Handspring',
    core: false,
    apparatus: Apparatus.HAMMOCK,
    level: Level.ADVANCED,
    taughtIn: [Level.ADVANCED, Level.TECH_3],
    notes: 'Forward rotation with hand support',
    cues: 'Run, hurdle, block through shoulders',
    parentId: id(34),
    siblings: [id(36)],
    applicableWeeks: [],
  },

  // Elite Ground Skills
  {
    id: id(38),
    name: 'Aerial Cartwheel',
    core: false,
    apparatus: Apparatus.HAMMOCK,
    level: Level.ELITE,
    taughtIn: [Level.ELITE, Level.ADVANCED],
    notes: 'No hands cartwheel',
    cues: 'Powerful hurdle, lift back leg high, no hands',
    parentId: id(35),
    siblings: [id(39)],
    applicableWeeks: [],
  },
  {
    id: id(39),
    name: 'Back Tuck',
    core: false,
    apparatus: Apparatus.HAMMOCK,
    level: Level.ELITE,
    taughtIn: [Level.ELITE],
    notes: 'Backward somersault',
    cues: 'Jump up, tuck knees to chest, spot landing',
    parentId: id(36),
    siblings: [id(38)],
    applicableWeeks: [],
  },

  // ===== FLEXIBILITY & CONDITIONING =====

  // Basic Flexibility
  {
    id: id(40),
    name: 'Bridge',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER, Level.TECH_1],
    notes: 'Basic back flexibility',
    cues: 'Push up from shoulders, straight arms',
    parentId: null,
    siblings: [id(41)],
    applicableWeeks: [],
  },
  {
    id: id(41),
    name: 'Split',
    core: true,
    apparatus: Apparatus.HAMMOCK,
    level: Level.BEGINNER,
    taughtIn: [Level.BEGINNER, Level.TECH_1],
    notes: 'Basic leg flexibility',
    cues: 'Square hips, front leg straight',
    parentId: null,
    siblings: [id(40)],
    applicableWeeks: [],
  },

  // Advanced Flexibility
  {
    id: id(42),
    name: 'Needle Scale',
    core: false,
    apparatus: Apparatus.HAMMOCK,
    level: Level.ADVANCED,
    taughtIn: [Level.ADVANCED, Level.TECH_3],
    notes: 'Standing back bend with leg extension',
    cues: 'Reach back leg to head, balance on standing leg',
    parentId: id(40),
    siblings: [],
    applicableWeeks: [],
  },
  {
    id: id(43),
    name: 'Oversplit',
    core: false,
    apparatus: Apparatus.HAMMOCK,
    level: Level.ADVANCED,
    taughtIn: [Level.ADVANCED, Level.TECH_3],
    notes: 'Split beyond 180 degrees',
    cues: 'Elevate front or back leg, maintain square hips',
    parentId: id(41),
    siblings: [],
    applicableWeeks: [],
  },
];

export const mockDbSkills: DBSkill[] = mockSkills.map(skill =>
  toDBSkill(skill)
);
