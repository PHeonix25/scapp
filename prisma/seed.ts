import { PrismaClient, UserRole, type Class, type Skill } from '../src/generated/prisma';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClear = !args.includes('--no-clear');

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data if not disabled
  if (shouldClear) {
    console.log('🧹 Clearing existing data...');
    await prisma.studentSkillProgress.deleteMany();
    await prisma.classPlanSkill.deleteMany();
    await prisma.classPlan.deleteMany();
    await prisma.classEnrollment.deleteMany();
    await prisma.class.deleteMany();
    await prisma.student.deleteMany();
    await prisma.instructor.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.user.deleteMany();
  } else {
    console.log('⏭️  Skipping data clearing (--no-clear flag detected)');
  }

  // Import mock data with type assertions
  const { users } = await import('../src/server/mocks/users');
  const { students } = await import('../src/server/mocks/students');
  const { instructors } = await import('../src/server/mocks/instructors');
  const { classes } = await import('../src/server/mocks/classes');
  const { mockDbSkills } = await import('../src/server/mocks/skills');
  const { classPlans } = await import('../src/server/mocks/classPlans');
  const { studentProgress } = await import(
    '../src/server/mocks/studentProgress'
  );

  // Combine all mock data
  const allUsers = [...users];

  // First, ensure all instructors have user accounts
  instructors.forEach(instructor => {
    if (!allUsers.some(u => u.email === instructor.email)) {
      allUsers.push({
        name: instructor.name,
        email: instructor.email,
        phone: instructor.phone,
        address: instructor.address,
        gender: instructor.gender,
        username: instructor.email.split('@')[0] ?? '',
        password: 'password123', // Default password for mock users
        role: UserRole.INSTRUCTOR,
      });
    }
  });

  // Then, ensure all students have user accounts
  students.forEach(student => {
    if (!allUsers.some(u => u.email === student.email)) {
      allUsers.push({
        name: student.name,
        email: student.email,
        phone: student.phone,
        address: student.address,
        gender: student.gender,
        username: student.email.split('@')[0] ?? '',
        password: 'password123', // Default password for mock users
        role: UserRole.STUDENT,
      });
    }
  });

  // Seed Users
  console.log('👥 Seeding users...');
  const createdUsers = [];

  for (const user of allUsers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        console.log(`ℹ️  User already exists: ${user.email}`);
        createdUsers.push(existingUser);
        continue;
      }

      // Create new user
      const hashedPassword = await hash(user.password, 12);
      const newUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          username: user.username,
          password: hashedPassword,
          role: user.role,
        },
      });

      createdUsers.push(newUser);
      console.log(`✅ Created user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error);
    }
  }

  // Create a map of email to user ID for easier lookup
  const userEmailToId = new Map(
    createdUsers.map(user => [user.email, user.id])
  );

  // Seed Students
  console.log('🎓 Seeding students...');
  const createdStudents = [];

  for (const student of students) {
    try {
      const userId = userEmailToId.get(student.email);
      if (!userId) {
        console.error(
          `User not found for student: ${student.name} (${student.email})`
        );
        continue;
      }

      // Check if student already exists
      const existingStudent = await prisma.student.findFirst({
        where: {
          OR: [{ userId }, { clubworxId: student.clubworxId }],
        },
      });

      if (existingStudent) {
        console.log(
          `ℹ️  Student already exists: ${student.name} (${student.email})`
        );
        createdStudents.push(existingStudent);
        continue;
      }

      // Create new student
      const newStudent = await prisma.student.create({
        data: {
          clubworxId: student.clubworxId,
          userId,
        },
      });

      createdStudents.push(newStudent);
      console.log(`✅ Created student: ${student.name}`);
    } catch (error) {
      console.error(`❌ Error creating student ${student.name}:`, error);
    }
  }

  // Create a map of clubworxId to student ID
  // const studentClubworxToId = new Map(
  //   createdStudents.map(s => [s.clubworxId, s.id])
  // );

  // Seed Instructors
  console.log('👨‍🏫 Seeding instructors...');
  const createdInstructors = [];

  for (const instructor of instructors) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: instructor.email },
      });

      if (!user) {
        console.error(`❌ User not found for instructor: ${instructor.email}`);
        continue;
      }

      // Convert apparatusLevel to the correct format
      const apparatusLevel = instructor.apparatusLevel.map(
        ([apparatus, level]) => ({
          apparatus,
          level,
        })
      );

      console.log(
        `Creating/Updating instructor ${instructor.name} with apparatusLevel:`,
        apparatusLevel
      );

      const instructorRecord = await prisma.instructor.upsert({
        where: { clubworxId: instructor.clubworxId },
        update: {
          userId: user.id,
          apparatusLevel,
        },
        create: {
          clubworxId: instructor.clubworxId,
          user: { connect: { id: user.id } },
          apparatusLevel,
        },
      });

      createdInstructors.push(instructorRecord);
      console.log(`✅ Created/Updated instructor: ${instructor.name}`);
    } catch (error) {
      console.error(
        `❌ Error creating/updating instructor ${instructor.name}:`,
        error
      );
    }
  }

  // Create a map of clubworxId to instructor ID
  // const instructorClubworxToId = new Map(
  //   createdInstructors.map(i => [i.clubworxId, i.id])
  // );

  // Seed Classes
  console.log('🏫 Seeding classes...');
  const createdClasses = [];

  for (const cls of classes) {
    try {
      // Find the instructor for this class
      const instructor = createdInstructors.find(
        i => i.clubworxId === cls.instructor.clubworxId
      );
      if (!instructor) {
        console.error(`Instructor not found for class: ${cls.name}`);
        continue;
      }

      // Check if class already exists (based on unique combination of properties)
      const existingClass = await prisma.class.findFirst({
        where: {
          name: cls.name,
          instructorId: instructor.id,
        },
      });

      let classRecord: Class;
      if (existingClass) {
        console.log(`ℹ️  Class already exists: ${cls.name}`);
        classRecord = existingClass;
      } else {
        // Create the class
        const classData: Omit<Class, 'id'> = {
          clubworxId: 0,
          name: cls.name,
          type: cls.type,
          level: cls.level,
          apparatus: cls.apparatus,
          startDate: cls.startDate,
          endDate: cls.endDate,
          instructorId: instructor.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        classRecord = await prisma.class.create({
          data: classData,
        });
        console.log(`✅ Created class: ${cls.name}`);
      }

      // Handle enrollments if students are provided
      if ('students' in cls && Array.isArray(cls.students)) {
        // Get all existing enrollments for this class
        const existingEnrollments = await prisma.classEnrollment.findMany({
          where: { classId: classRecord.id },
          select: { studentId: true },
        });

        // Create a Set of existing student IDs for quick lookup
        const existingStudentIds = new Set(
          existingEnrollments.map(e => e.studentId)
        );

        // Find all students that should be enrolled in this class
        const studentsToEnroll = [];

        for (const studentData of cls.students) {
          // Find the student by clubworxId in our created students
          const student = createdStudents.find(
            s => s.clubworxId === studentData.clubworxId
          );

          // If we found the student and they're not already enrolled, add them to the list
          if (student && !existingStudentIds.has(student.id)) {
            studentsToEnroll.push(student);
          } else if (!student) {
            console.warn(
              `⚠️ Student not found: ${studentData.name} (${studentData.email})`
            );
          }
        }

        // Only proceed if we have students to enroll
        if (studentsToEnroll.length > 0) {
          const enrollmentData = studentsToEnroll.map(student => ({
            classId: classRecord.id,
            studentId: student.id,
          }));

          // Create enrollments one by one to handle potential duplicates
          for (const data of enrollmentData) {
            try {
              await prisma.classEnrollment.upsert({
                where: {
                  classId_studentId: {
                    classId: data.classId,
                    studentId: data.studentId,
                  },
                },
                update: {},
                create: data,
              });
            } catch (error) {
              console.warn(
                `⚠️  Warning: Could not enroll student ${data.studentId} in class ${data.classId}`,
                error
              );
            }
          }

          console.log(
            `  ✅ Processed enrollment for ${studentsToEnroll.length} students in ${cls.name}`
          );
        }
      }

      createdClasses.push(classRecord);
    } catch (error) {
      console.error(`❌ Error processing class ${cls.name}:`, error);
    }
  }

  // Seed Skills
  console.log('\n🎯 Seeding skills...');
  const createdSkills = new Map<string, Skill>();

  // First pass: Create all skills without relationships
  for (const skill of mockDbSkills) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, children, siblings, ...skillData } = skill;
      // Convert to DBSkill format (taughtIn as string)
      const dbSkill = {
        ...skillData,
        taughtIn: Array.isArray(skillData.taughtIn)
          ? skillData.taughtIn.join(',')
          : skillData.taughtIn,
        applicableWeeks: skillData.applicableWeeks || [1, 2, 3, 4, 5, 6, 7, 8], // Default weeks if not specified
        ...(id && { id }), // Only include id if it exists
      };

      const createdSkill = await prisma.skill.upsert({
        where: { id: skill.id },
        update: dbSkill,
        create: dbSkill,
      });
      createdSkills.set(skill.id, createdSkill);
      console.log(`✅ Created skill: ${skill.name}`);
    } catch (error) {
      console.error(`❌ Error creating skill ${skill.name}:`, error);
      throw error; // Rethrow to stop execution on error
    }
  }

  // Second pass: Create parent-child relationships
  for (const skill of mockDbSkills) {
    if (skill.parentId) {
      const parentSkill = createdSkills.get(skill.parentId);
      const childSkill = createdSkills.get(skill.id);

      if (parentSkill && childSkill) {
        try {
          await prisma.skill.update({
            where: { id: childSkill.id },
            data: {
              parent: { connect: { id: parentSkill.id } },
            },
          });
          console.log(
            `🔗 Linked skill: ${childSkill.name} → ${parentSkill.name}`
          );
        } catch (error) {
          console.error(
            `❌ Error linking skill ${childSkill.name} to ${parentSkill.name}:`,
            error
          );
          throw error; // Rethrow to stop execution on error
        }
      }
    }
  }

  // Third pass: Create sibling relationships using the SkillSiblings relation
  for (const skill of mockDbSkills) {
    if (skill.siblings && skill.siblings.length > 0) {
      const currentSkill = createdSkills.get(skill.id);

      if (currentSkill) {
        try {
          // Get the sibling IDs that exist in our created skills
          const siblingIds = skill.siblings
            .map((id: string) => createdSkills.get(id)?.id)
            .filter((id: string | undefined): id is string => !!id);

          // Update the current skill to connect its siblings
          await prisma.skill.update({
            where: { id: currentSkill.id },
            data: {
              sibling_skills: {
                connect: siblingIds.map((id: string) => ({ id })),
              },
            },
          });

          console.log(
            `🔗 Connected ${siblingIds.length} siblings to ${currentSkill.name}`
          );
        } catch (error) {
          console.error(
            `❌ Error connecting siblings for ${currentSkill.name}:`,
            error
          );
          throw error; // Rethrow to stop execution on error
        }
      }
    }
  }

  // Seed Class Plans
  console.log('\n📋 Seeding class plans...');
  const createdClassPlans = [];

  // Create a map of class names to IDs for easier lookup
  const classNameToId = new Map();
  for (const cls of createdClasses) {
    // Create a simple key from class name
    const key = cls.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    classNameToId.set(key, cls.id);
  }

  for (const planData of classPlans) {
    try {
      // Map the classId from the mock data to actual class ID
      let actualClassId = null;

      // Try to find matching class by name pattern
      for (const [key, id] of classNameToId.entries()) {
        if (
          key.includes('beginner-silks') &&
          planData.classId === 'beginner-silks-monday'
        ) {
          actualClassId = id;
          break;
        } else if (
          key.includes('tech-1-silks') &&
          planData.classId === 'tech1-silks'
        ) {
          actualClassId = id;
          break;
        } else if (
          key.includes('advanced-silks') &&
          planData.classId === 'advanced-silks'
        ) {
          actualClassId = id;
          break;
        } else if (
          key.includes('beginner-lyra') &&
          planData.classId === 'beginner-lyra-wednesday'
        ) {
          actualClassId = id;
          break;
        } else if (
          key.includes('kids-silks') &&
          planData.classId === 'kids-silks-saturday'
        ) {
          actualClassId = id;
          break;
        } else if (
          key.includes('summer-holiday') &&
          planData.classId === 'summer-workshop'
        ) {
          actualClassId = id;
          break;
        }
      }

      if (!actualClassId) {
        console.warn(`⚠️  Could not find class for plan: ${planData.title}`);
        continue;
      }

      // Create the class plan
      const classPlan = await prisma.classPlan.create({
        data: {
          title: planData.title,
          ...(planData.description && { description: planData.description }),
          date: planData.date,
          weekOfYear: planData.weekOfYear,
          duration: planData.duration,
          classId: actualClassId,
          ...(planData.notes && { notes: planData.notes }),
        },
      });

      // Add skills to the class plan
      for (let i = 0; i < planData.skillIds.length; i++) {
        const skillId = planData.skillIds[i];
        if (!skillId)
          throw new Error('ClassPlan contained a Skill not located in Skills!');

        const skill = createdSkills.get(skillId);
        if (skill) {
          await prisma.classPlanSkill.create({
            data: {
              classPlanId: classPlan.id,
              skillId: skill.id,
              order: i + 1,
            },
          });
        }
      }

      createdClassPlans.push(classPlan);
      console.log(`✅ Created class plan: ${planData.title}`);
    } catch (error) {
      console.error(`❌ Error creating class plan ${planData.title}:`, error);
    }
  }

  // Seed Student Skill Progress
  console.log('\n📈 Seeding student skill progress...');

  for (const progressData of studentProgress) {
    try {
      // Find the student by clubworxId
      const student = createdStudents.find(
        s => s.clubworxId === progressData.studentClubworxId
      );
      if (!student) {
        console.warn(
          `⚠️  Student not found: ${progressData.studentClubworxId}`
        );
        continue;
      }

      // Find the skill
      const skill = createdSkills.get(progressData.skillId);
      if (!skill) {
        console.warn(`⚠️  Skill not found: ${progressData.skillId}`);
        continue;
      }

      // Create the progress record
      await prisma.studentSkillProgress.upsert({
        where: {
          studentId_skillId: {
            studentId: student.id,
            skillId: skill.id,
          },
        },
        update: {
          status: progressData.status,
          notes: progressData.notes,
          reason: progressData.reason,
          assessedBy: progressData.assessedBy,
          assessedAt: progressData.assessedAt,
        },
        create: {
          studentId: student.id,
          skillId: skill.id,
          status: progressData.status,
          notes: progressData.notes,
          reason: progressData.reason,
          assessedBy: progressData.assessedBy,
          assessedAt: progressData.assessedAt,
        },
      });

      console.log(
        `✅ Created progress record: ${progressData.studentClubworxId} - ${progressData.skillId}`
      );
    } catch (error) {
      console.error(`❌ Error creating progress record:`, error);
    }
  }

  console.log('\n✅ Database seeded successfully!\n');
  console.log(`ℹ️  Seeded data summary:`);
  console.log(`- 👥 Users: ${await prisma.user.count()}`);
  console.log(`- 🎓 Students: ${await prisma.student.count()}`);
  console.log(`- 🧑‍🏫 Instructors: ${await prisma.instructor.count()}`);
  console.log(`- 🏫 Classes: ${await prisma.class.count()}`);
  console.log(
    `- 📚 Class Enrollments: ${await prisma.classEnrollment.count()}`
  );
  console.log(`- 🎯 Skills: ${await prisma.skill.count()}`);
  console.log(`- 📋 Class Plans: ${await prisma.classPlan.count()}`);
  console.log(`- 🔗 Class Plan Skills: ${await prisma.classPlanSkill.count()}`);
  console.log(
    `- 📈 Student Progress Records: ${await prisma.studentSkillProgress.count()}`
  );
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
