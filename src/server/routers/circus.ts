
import { z } from 'zod';


import type {
  ApparatusLevel,
  InstructorUser,
  SkillWithProgress,
  StudentUser,
  User,
} from '@/types';
import {Apparatus, ClassType, Level,  UserRole} from '@/types';

import type { Skill as PrismaSkill, SkillProgressStatus } from '@/generated/prisma';

import { prisma } from '../db';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { JsonValue } from '@/generated/prisma/runtime/client';

// Helper function to get week of year from date
function getWeekOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

export const circusRouter = createTRPCRouter({
  // User endpoints
  createUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        gender: z.string(),
        username: z.string(),
        password: z.string().min(8),
        role: z.nativeEnum(UserRole),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { ...userData } = input;

      const user = await ctx.db.user.create({
        data: userData,
        include: {
          student: true,
        },
      });
      return user;
    }),

  getUserByClubworxId: publicProcedure
    .input(
      z.object({
        clubworxId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = (await prisma.user.findFirst({
        where: {
          student: {
            clubworxId: input.clubworxId,
          },
        },
        include: {
          student: true,
        },
      })) as User;
      return user;
    }),

  // Student endpoints
  createStudent: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        gender: z.string(),
        clubworxId: z.string(),
        username: z.string(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      const { clubworxId, ...userData } = input;
      // First create the user
      const user = (await prisma.user.create({
        data: {
          ...userData,
          role: UserRole.STUDENT,
          student: {
            create: {
              clubworxId,
            },
          },
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      })) as User;
      return user;
    }),

  getStudents: publicProcedure.query(
    async (): Promise<StudentUser[] | null> => {
      const students = await prisma.student.findMany({
        include: {
          user: true,
        },
      });
      return students.map(student => ({
        id: student.id, // Keep the student ID as the primary ID
        userId: student.user.id,
        clubworxId: student.clubworxId,
        name: student.user.name,
        email: student.user.email,
        phone: student.user.phone,
        address: student.user.address,
        gender: student.user.gender,
        username: student.user.username,
        role: student.user.role,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      })) as StudentUser[];
    }
  ),

  // Instructor endpoints
  createInstructor: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        address: z.string(),
        gender: z.string(),
        clubworxId: z.string(),
        username: z.string(),
        password: z.string().min(8),
        apparatusLevel: z.array(
          z.tuple([z.nativeEnum(Apparatus), z.nativeEnum(Level)])
        ),
      })
    )
    .mutation(async ({ input }) => {
      const { apparatusLevel, clubworxId, ...userData } = input;
      const user = (await prisma.user.create({
        data: {
          ...userData,
          role: UserRole.INSTRUCTOR,
          instructor: {
            create: {
              clubworxId,
              apparatusLevel,
            },
          },
        },
        include: {
          instructor: {
            include: {
              user: true,
            },
          },
        },
      })) as User;
      return user;
    }),

  getInstructors: publicProcedure.query(
    async (): Promise<InstructorUser[] | null> => {
      // Fetch instructors with their user data
      const instructors = await prisma.instructor.findMany({
        include: {
          user: true,
        },
      });

      // Create a helper function to parse apparatusLevel

      const parseApparatusLevel = (
        apparatusLevel: JsonValue | ApparatusLevel[]
      ): ApparatusLevel[] => {
        try {
          // If it's already in the correct format, return it
          if (
            Array.isArray(apparatusLevel) &&
            (apparatusLevel as ApparatusLevel[]).every(
              item =>
                item?.apparatus &&
                item.level &&
                Object.values(Apparatus).includes(item.apparatus) &&
                Object.values(Level).includes(item.level)
            )
          ) {
            return apparatusLevel as ApparatusLevel[];
          }

          // If it's a string, try to parse it
          if (typeof apparatusLevel === 'string') {
            const parsed = JSON.parse(apparatusLevel);
            if (Array.isArray(parsed)) {
              return parsed.filter(
                item =>
                  item?.apparatus &&
                  item.level &&
                  Object.values(Apparatus).includes(item.apparatus) &&
                  Object.values(Level).includes(item.level)
              ) as ApparatusLevel[];
            }
          }

          // If we get here, return an empty array
          return [];
        } catch (error) {
          console.error('Error parsing apparatusLevel:', error);
          return [];
        }
      };

      // Map instructors and ensure apparatusLevel is always an array
      return instructors.map(instructor => {
        // Parse the apparatusLevel field
        const parsedApparatusLevel = parseApparatusLevel(
          instructor.apparatusLevel ?? []
        );

        return {
          ...instructor,
          ...instructor.user,
          apparatusLevel: parsedApparatusLevel,
        } as InstructorUser;
      });
    }
  ),

  // Class endpoints
  createClass: publicProcedure
    .input(
      z.object({
        name: z.string(),
        clubworxId: z.number(),
        type: z.nativeEnum(ClassType),
        instructorId: z.string(),
        studentIds: z.array(z.string()),
        startDate: z.string().transform(str => new Date(str)),
        endDate: z.string().transform(str => new Date(str)),
        apparatus: z.nativeEnum(Apparatus),
        level: z.nativeEnum(Level),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { studentIds, instructorId, ...classData } = input;

      // First verify the instructor exists
      const instructor = await ctx.db.instructor.findUnique({
        where: { id: instructorId },
        include: { user: true },
      });

      if (!instructor) {
        const instructors = (
          await ctx.db.instructor.findMany({ include: { user: true } })
        ).map(i => {
          // console.log('[ClassCreation]>> located instructor:', i.id);
          return i.id;
        });
        throw new Error(
          `Instructor not found. Possible instructors: ${instructors.join(', ')}`
        );
      }

      // Verify all student IDs exist
      const students = await ctx.db.student.findMany({
        where: { id: { in: studentIds } },
        include: { user: true },
      });
      // console.log(
      //   `[ClassCreation]>> located ${students.length} of ${studentIds.length} students...`
      // );
      if (students.length !== studentIds.length) {
        throw new Error('One or more students not found');
      }

      // Create the class with enrollments
      const result = await ctx.db.class.create({
        data: {
          ...classData,
          instructorId,
          enrollments: {
            create: studentIds.map(studentId => ({
              student: {
                connect: { id: studentId },
              },
            })),
          },
        },
        include: {
          instructor: {
            include: {
              user: true,
            },
          },
          enrollments: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      // console.log('[ClassCreation]>> class created:', result);
      return result;
    }),

  getClasses: publicProcedure.query(async () => {
    return await prisma.class.findMany({
      include: {
        instructor: {
          include: {
            user: true,
          },
        },
        enrollments: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }),

  getClassById: publicProcedure
    .input(
      z.object({
        classId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.class.findUnique({
        where: { id: input.classId },
      });
    }),

  getSkills: publicProcedure.query(async (): Promise<PrismaSkill[] | null> => {
    return await prisma.skill.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }),

  // Student skill progress endpoints
  getStudentSkillProgress: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
        apparatusFilter: z.nativeEnum(Apparatus).optional(),
        levelFilter: z.nativeEnum(Level).optional(),
      })
    )
    .query(async ({ input }) => {
      const { studentId, apparatusFilter, levelFilter } = input;

      // Get all skills with optional filters
      const skillsWhere: { apparatus?: Apparatus; level?: Level } = {};
      if (apparatusFilter) skillsWhere.apparatus = apparatusFilter;
      if (levelFilter) skillsWhere.level = levelFilter;

      const skills = await prisma.skill.findMany({
        where: skillsWhere,
        include: {
          progress: {
            where: { studentId },
          },
        },
        orderBy: [{ apparatus: 'asc' }, { level: 'asc' }, { name: 'asc' }],
      });

      // Transform to include progress status
      return skills.map(skill => ({
        ...skill,
        progressStatus: skill.progress[0]?.status ?? 'NOT_ATTEMPTED',
        progressNotes: skill.progress[0]?.notes ?? null,
        progressReason: skill.progress[0]?.reason ?? null,
        assessedBy: skill.progress[0]?.assessedBy ?? null,
        assessedAt: skill.progress[0]?.assessedAt ?? null,
      }) as SkillWithProgress);
    }),

  updateStudentSkillProgress: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
        skillId: z.string(),
        status: z.enum([
          'NOT_ATTEMPTED',
          'ATTEMPTED',
          'COMPETENT',
          'MASTERED',
          'EXCEPTED',
        ]),
        notes: z.string().optional(),
        reason: z.string().optional(),
        assessedBy: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { studentId, skillId, status, notes, reason, assessedBy } = input;

      return await prisma.studentSkillProgress.upsert({
        where: {
          studentId_skillId: {
            studentId,
            skillId,
          },
        },
        update: {
          status: status as SkillProgressStatus,
          notes,
          reason,
          assessedBy,
          assessedAt: new Date(),
        },
        create: {
          studentId,
          skillId,
          status: status as SkillProgressStatus,
          notes,
          reason,
          assessedBy,
          assessedAt: new Date(),
        },
      });
    }),

  getStudentById: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.student.findUnique({
        where: { id: input.studentId },
        include: {
          user: true,
          skillProgress: {
            include: {
              skill: true,
            },
          },
        },
      });
    }),

  // Utility endpoints
  // Class Plan endpoints
  createClassPlan: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().transform(str => new Date(str)),
        duration: z.number().min(1),
        classId: z.string(),
        skillIds: z.array(z.string()),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { skillIds, date, ...classPlanData } = input;

      // Calculate week of year from date
      const weekOfYear = getWeekOfYear(date);

      // Verify the class exists
      const classExists = await prisma.class.findUnique({
        where: { id: input.classId },
      });

      if (!classExists) {
        throw new Error('Class not found');
      }

      // Verify all skill IDs exist
      const skills = await prisma.skill.findMany({
        where: { id: { in: skillIds } },
      });

      if (skills.length !== skillIds.length) {
        throw new Error('One or more skills not found');
      }

      // Create the class plan with skills
      return await prisma.classPlan.create({
        data: {
          ...classPlanData,
          date,
          weekOfYear,
          skills: {
            create: skillIds.map((skillId, index) => ({
              skillId,
              order: index + 1,
            })),
          },
        },
        include: {
          class: {
            include: {
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
          skills: {
            include: {
              skill: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    }),

  getClassPlans: publicProcedure
    .input(
      z.object({
        classId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where = input.classId ? { classId: input.classId } : {};

      return await prisma.classPlan.findMany({
        where,
        include: {
          class: {
            include: {
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
          skills: {
            include: {
              skill: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    }),

  getClassPlanById: publicProcedure
    .input(
      z.object({
        classPlanId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.classPlan.findUnique({
        where: { id: input.classPlanId },
        include: {
          class: {
            include: {
              instructor: {
                include: {
                  user: true,
                },
              },
              enrollments: {
                include: {
                  student: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          skills: {
            include: {
              skill: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    }),

  updateClassPlan: publicProcedure
    .input(
      z.object({
        classPlanId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        date: z
          .string()
          .transform(str => new Date(str))
          .optional(),
        duration: z.number().min(1).optional(),
        skillIds: z.array(z.string()).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { classPlanId, skillIds, date, ...updateData } = input;

      // Calculate week of year if date is provided
      const weekOfYear = date ? getWeekOfYear(date) : undefined;

      // If skillIds are provided, verify they exist
      if (skillIds) {
        const skills = await prisma.skill.findMany({
          where: { id: { in: skillIds } },
        });

        if (skills.length !== skillIds.length) {
          throw new Error('One or more skills not found');
        }
      }

      // Update the class plan
      const updatedClassPlan = await prisma.classPlan.update({
        where: { id: classPlanId },
        data: {
          ...updateData,
          ...(date && { date, weekOfYear }),
          ...(skillIds && {
            skills: {
              deleteMany: {},
              create: skillIds.map((skillId, index) => ({
                skillId,
                order: index + 1,
              })),
            },
          }),
        },
        include: {
          class: {
            include: {
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
          skills: {
            include: {
              skill: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      return updatedClassPlan;
    }),

  deleteClassPlan: publicProcedure
    .input(
      z.object({
        classPlanId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.classPlan.delete({
        where: { id: input.classPlanId },
      });
    }),

  // Get skills filtered by apparatus and level for class plan creation
  getSkillsForClassPlan: publicProcedure
    .input(
      z.object({
        apparatus: z.nativeEnum(Apparatus).optional(),
        level: z.nativeEnum(Level).optional(),
      })
    )
    .query(async ({ input }) => {
      const where: { apparatus?: Apparatus; level?: Level } = {};
      if (input.apparatus) where.apparatus = input.apparatus;
      if (input.level) where.level = input.level;

      return await prisma.skill.findMany({
        where,
        orderBy: [{ apparatus: 'asc' }, { level: 'asc' }, { name: 'asc' }],
      });
    }),

  // Get suggested skills for a specific week
  getSuggestedSkillsForWeek: publicProcedure
    .input(
      z.object({
        weekOfYear: z.number().min(1).max(53),
        apparatus: z.nativeEnum(Apparatus).optional(),
        level: z.nativeEnum(Level).optional(),
      })
    )
    .query(async ({ input }) => {
      const { weekOfYear, apparatus, level } = input;

      // Build the where clause
      const where: { apparatus?: Apparatus; level?: Level } = {};
      if (apparatus) where.apparatus = apparatus;
      if (level) where.level = level;

      // Get all skills and filter by applicable weeks in application logic
      // since SQLite doesn't have great JSON array querying
      const allSkills = await prisma.skill.findMany({
        where,
        orderBy: [{ apparatus: 'asc' }, { level: 'asc' }, { name: 'asc' }],
      });

      // Filter skills that are applicable for this week
      const suggestedSkills = allSkills.filter(skill => {
        try {
          const applicableWeeks = Array.isArray(skill.applicableWeeks)
            ? skill.applicableWeeks
            : JSON.parse(skill.applicableWeeks as string);
          return (
            Array.isArray(applicableWeeks) &&
            applicableWeeks.includes(weekOfYear)
          );
        } catch (error) {
          console.error(
            'Error parsing applicableWeeks for skill:',
            skill.id,
            error
          );
          return false;
        }
      });

      return suggestedSkills;
    }),

  // Get skills for a date (calculates week automatically)
  getSuggestedSkillsForDate: publicProcedure
    .input(
      z.object({
        date: z.string().transform(str => new Date(str)),
        apparatus: z.nativeEnum(Apparatus).optional(),
        level: z.nativeEnum(Level).optional(),
      })
    )
    .query(async ({ input }) => {
      const { date, apparatus, level } = input;
      const weekOfYear = getWeekOfYear(date);

      // Build the where clause
      const where: { apparatus?: Apparatus; level?: Level } = {};
      if (apparatus) where.apparatus = apparatus;
      if (level) where.level = level;

      // Get all skills and filter by applicable weeks
      const allSkills = await prisma.skill.findMany({
        where,
        orderBy: [{ apparatus: 'asc' }, { level: 'asc' }, { name: 'asc' }],
      });

      // Filter skills that are applicable for this week
      const suggestedSkills = allSkills.filter(skill => {
        try {
          const applicableWeeks = Array.isArray(skill.applicableWeeks)
            ? skill.applicableWeeks
            : JSON.parse(skill.applicableWeeks as string);
          return (
            Array.isArray(applicableWeeks) &&
            applicableWeeks.includes(weekOfYear)
          );
        } catch (error) {
          console.error(
            'Error parsing applicableWeeks for skill:',
            skill.id,
            error
          );
          return false;
        }
      });

      return {
        weekOfYear,
        skills: suggestedSkills,
      };
    }),

  // Update skill applicable weeks
  updateSkillApplicableWeeks: publicProcedure
    .input(
      z.object({
        skillId: z.string(),
        applicableWeeks: z.array(z.number().min(1).max(53)),
      })
    )
    .mutation(async ({ input }) => {
      const { skillId, applicableWeeks } = input;

      return await prisma.skill.update({
        where: { id: skillId },
        data: {
          applicableWeeks,
        },
      });
    }),

  // Get class plans that use a specific skill
  getClassPlansUsingSkill: publicProcedure
    .input(
      z.object({
        skillId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { skillId } = input;

      return await prisma.classPlan.findMany({
        where: {
          skills: {
            some: {
              skillId,
            },
          },
        },
        include: {
          class: {
            include: {
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
          skills: {
            where: {
              skillId,
            },
            include: {
              skill: true,
            },
          },
        },
        orderBy: {
          date: 'desc',
        },
      });
    }),

  getEnums: publicProcedure.query(() => ({
    UserRole,
    ClassType,
    Apparatus,
    Level,
  })),
});
