-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('APPLICANT', 'STUDENT', 'PARENT', 'TEACHER', 'ADMIN');

-- CreateTable
CREATE TABLE "user" (
    "userID" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "accessLevel" "UserRole" NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "gender" TEXT,
    "birthdate" TIMESTAMP(3),
    "address" TEXT,
    "user_status" TEXT NOT NULL,
    "classroomId" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userID")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_userName_key" ON "user"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
