/*
  Warnings:

  - A unique constraint covering the columns `[applicant_number]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicant_number` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "applicant_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_applicant_number_key" ON "Applicant"("applicant_number");
