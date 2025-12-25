// Import Prisma types
import type {
  Apparatus,
  Class,
  ClassPlan,
  ClassPlanSkill,
  Instructor,
  Level,
  Skill as PrismaSkill,
  Student,
  User,
} from '../generated/prisma';

import type { ClubworxMember } from '@/lib/clubworx/types';

// These ones we reuse a lot - re-export them
export { Apparatus, Level, ClassType, type User, UserRole } from '../generated/prisma'; 

// Helper type for classes with relations
export type ClassWithRelations = Class & {
  instructor: InstructorUser;
  enrollments: Array<{
    student: StudentUser;
  }>;
};

// Helper type for students with user data
export type StudentUser = User & Student;

// Helper type for instructors with user data
export type InstructorUser = Omit<Instructor, 'apparatusLevel'> &
  User & { apparatusLevel: ApparatusLevel[] };

// Helper type for all Clubworx members
export type ClubworxUser = ClubworxMember & User;


// Helper type for class plans with relations
export type ClassPlanWithRelations = ClassPlan & {
  class: ClassWithRelations;
  skills: Array<
    ClassPlanSkill & {
      skill: PrismaSkill;
    }
  >;
};

// Helper type for class plan creation
export interface CreateClassPlanInput {
  title: string;
  description?: string;
  date: Date;
  duration: number;
  classId: string;
  skillIds: string[];
  notes?: string;
}

// Helper type for class plan update
export interface UpdateClassPlanInput {
  classPlanId: string;
  title?: string;
  description?: string;
  date?: Date;
  duration?: number;
  skillIds?: string[];
  notes?: string;
}

// Helper type for skills with applicable weeks
export type SkillWithWeeks = PrismaSkill & {
  applicableWeeks: number[];
};

export interface ApparatusLevel {
  apparatus: Apparatus;
  level: Level;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
  apparatus: Apparatus;
  level: Level;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillProgressStatus =
  | 'NOT_ATTEMPTED'
  | 'ATTEMPTED'
  | 'COMPETENT'
  | 'MASTERED'
  | 'EXCEPTED';

export interface SkillWithProgress {
  id: string;
  name: string;
  core: boolean;
  apparatus: Apparatus;
  level: Level;
  taughtIn: string;
  notes: string;
  cues: string;
  progressStatus: SkillProgressStatus;
  progressNotes: string | null;
  progressReason: string | null;
  assessedBy: string | null;
  assessedAt: Date | null;
}
