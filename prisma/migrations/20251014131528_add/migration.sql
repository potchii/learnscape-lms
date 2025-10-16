/*
  Warnings:

  - A unique constraint covering the columns `[parent_number]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_number]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employee_number]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parent_number` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_number` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employee_number` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "parent_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "student_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "employee_number" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "IdCounter" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdCounter_type_year_key" ON "IdCounter"("type", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_parent_number_key" ON "Parent"("parent_number");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_number_key" ON "Student"("student_number");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_employee_number_key" ON "Teacher"("employee_number");
