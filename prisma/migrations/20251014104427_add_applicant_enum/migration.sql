-- CreateEnum
CREATE TYPE "ApplicantType" AS ENUM ('NEW', 'CONTINUING', 'RETURNEE', 'TRANSFEREE');

-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "type" "ApplicantType" NOT NULL DEFAULT 'NEW';
