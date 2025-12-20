-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "public"."ClassType" AS ENUM ('ADULT', 'KIDS_TEENS', 'SCHOOL_HOLIDAY_WORKSHOP', 'BIRTHDAY_PARTY', 'PRIVATE_LESSONS');

-- CreateEnum
CREATE TYPE "public"."Apparatus" AS ENUM ('SILKS', 'TRAPEZE', 'LYRA', 'HAMMOCK', 'CORDE_LISSE');

-- CreateEnum
CREATE TYPE "public"."Level" AS ENUM ('BEGINNER', 'TECH_1', 'TECH_2', 'TECH_3', 'ADVANCED', 'ELITE');

-- CreateEnum
CREATE TYPE "public"."SkillProgressStatus" AS ENUM ('NOT_ATTEMPTED', 'ATTEMPTED', 'COMPETENT', 'MASTERED', 'EXCEPTED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" TEXT NOT NULL,
    "clubworxId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Instructor" (
    "id" TEXT NOT NULL,
    "clubworxId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apparatusLevel" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ClassType" NOT NULL,
    "instructorId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "apparatus" "public"."Apparatus" NOT NULL,
    "level" "public"."Level" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClassEnrollment" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClassPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "weekOfYear" INTEGER NOT NULL DEFAULT 1,
    "duration" INTEGER NOT NULL,
    "classId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClassPlanSkill" (
    "id" TEXT NOT NULL,
    "classPlanId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassPlanSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "core" BOOLEAN NOT NULL,
    "apparatus" "public"."Apparatus" NOT NULL,
    "level" "public"."Level" NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "taughtIn" TEXT NOT NULL,
    "applicableWeeks" JSONB,
    "notes" TEXT NOT NULL,
    "cues" TEXT NOT NULL,
    "parent_id" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentSkillProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "status" "public"."SkillProgressStatus" NOT NULL DEFAULT 'NOT_ATTEMPTED',
    "notes" TEXT,
    "reason" TEXT,
    "assessedBy" TEXT,
    "assessedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentSkillProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_SkillSiblings" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SkillSiblings_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Student_clubworxId_key" ON "public"."Student"("clubworxId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "public"."Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_clubworxId_key" ON "public"."Instructor"("clubworxId");

-- CreateIndex
CREATE UNIQUE INDEX "Instructor_userId_key" ON "public"."Instructor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassEnrollment_classId_studentId_key" ON "public"."ClassEnrollment"("classId", "studentId");

-- CreateIndex
CREATE INDEX "ClassPlan_classId_idx" ON "public"."ClassPlan"("classId");

-- CreateIndex
CREATE INDEX "ClassPlan_date_idx" ON "public"."ClassPlan"("date");

-- CreateIndex
CREATE INDEX "ClassPlan_weekOfYear_idx" ON "public"."ClassPlan"("weekOfYear");

-- CreateIndex
CREATE INDEX "ClassPlanSkill_classPlanId_idx" ON "public"."ClassPlanSkill"("classPlanId");

-- CreateIndex
CREATE INDEX "ClassPlanSkill_skillId_idx" ON "public"."ClassPlanSkill"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassPlanSkill_classPlanId_skillId_key" ON "public"."ClassPlanSkill"("classPlanId", "skillId");

-- CreateIndex
CREATE INDEX "Skill_parent_id_idx" ON "public"."Skill"("parent_id");

-- CreateIndex
CREATE INDEX "StudentSkillProgress_studentId_idx" ON "public"."StudentSkillProgress"("studentId");

-- CreateIndex
CREATE INDEX "StudentSkillProgress_skillId_idx" ON "public"."StudentSkillProgress"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentSkillProgress_studentId_skillId_key" ON "public"."StudentSkillProgress"("studentId", "skillId");

-- CreateIndex
CREATE INDEX "_SkillSiblings_B_index" ON "public"."_SkillSiblings"("B");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Instructor" ADD CONSTRAINT "Instructor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."Instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassPlan" ADD CONSTRAINT "ClassPlan_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassPlanSkill" ADD CONSTRAINT "ClassPlanSkill_classPlanId_fkey" FOREIGN KEY ("classPlanId") REFERENCES "public"."ClassPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassPlanSkill" ADD CONSTRAINT "ClassPlanSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Skill" ADD CONSTRAINT "Skill_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentSkillProgress" ADD CONSTRAINT "StudentSkillProgress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentSkillProgress" ADD CONSTRAINT "StudentSkillProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SkillSiblings" ADD CONSTRAINT "_SkillSiblings_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SkillSiblings" ADD CONSTRAINT "_SkillSiblings_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

