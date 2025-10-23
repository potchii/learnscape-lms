This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where comments have been removed, line numbers have been added, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: *.test.ts, docs/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Line numbers have been added to the beginning of each line
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.eslintrc.json
.gitignore
components.json
eslint.config.mjs
next-auth.d.ts
next.config.ts
package.json
postcss.config.mjs
prisma/migrations/20251019182106_add_assignments/migration.sql
prisma/migrations/20251021185305_add_assignment_grade_relation/migration.sql
prisma/migrations/20251022142552_add_quiz_system/migration.sql
prisma/migrations/migration_lock.toml
prisma/schema.prisma
public/file.svg
public/globe.svg
public/next.svg
public/uploads/1761116572554_LearnScape_User_Stories.pdf
public/vercel.svg
public/window.svg
README.md
repomix.config.json
src/app/admin/applicants/[id]/approve/approve-form.tsx
src/app/admin/applicants/[id]/approve/page.tsx
src/app/admin/applicants/[id]/reject/page.tsx
src/app/admin/applicants/[id]/reject/reject-form.tsx
src/app/admin/applicants/[id]/review/page.tsx
src/app/admin/applicants/layout.tsx
src/app/admin/applicants/page.tsx
src/app/admin/dashboard/layout.tsx
src/app/admin/dashboard/page.tsx
src/app/admin/parents/[id]/layout.tsx
src/app/admin/parents/[id]/page.tsx
src/app/admin/sections/[id]/edit/page.tsx
src/app/admin/sections/[id]/students/page.tsx
src/app/admin/sections/layout.tsx
src/app/admin/sections/page.tsx
src/app/admin/students/[id]/edit/page.tsx
src/app/admin/students/[id]/page.tsx
src/app/api/admin/applicants/[id]/approve/route.ts
src/app/api/admin/applicants/[id]/reject/route.ts
src/app/api/admin/parents/[id]/route.ts
src/app/api/admin/parents/route.ts
src/app/api/admin/sections/[id]/classes/[classId]/route.ts
src/app/api/admin/sections/[id]/route.ts
src/app/api/admin/sections/route.ts
src/app/api/admin/students/[id]/route.ts
src/app/api/admin/teacher/route.ts
src/app/api/admin/users/[id]/route.ts
src/app/api/admin/users/route.ts
src/app/api/announcements/route.ts
src/app/api/applicant/status/route.ts
src/app/api/assignments/materials/route.ts
src/app/api/assignments/route.ts
src/app/api/attendance/history/route.ts
src/app/api/attendance/route.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/api/cron/generate-alerts/route.ts
src/app/api/grades/route.ts
src/app/api/materials/route.ts
src/app/api/parent/alerts/route.ts
src/app/api/quizzes/route.ts
src/app/api/signIn/route.ts
src/app/api/signup/route.ts
src/app/api/student/assignments/submit/route.ts
src/app/api/teacher/announcements/route.ts
src/app/api/teacher/assignments/route.ts
src/app/api/teacher/route.ts
src/app/api/test-id-generation/route.ts
src/app/api/upload/route.ts
src/app/applicant/portal/application/page.tsx
src/app/applicant/portal/layout.tsx
src/app/applicant/portal/page.tsx
src/app/applicant/portal/profile/page.tsx
src/app/favicon.ico
src/app/globals.css
src/app/layout.tsx
src/app/login/page.tsx
src/app/page.tsx
src/app/parent/alerts/page.tsx
src/app/parent/assignments/page.tsx
src/app/parent/dashboard/assignments/page.tsx
src/app/parent/dashboard/assignments/ParentAssignmentsView.tsx
src/app/parent/dashboard/page.tsx
src/app/parent/dashboard/schedule/page.tsx
src/app/parent/dashboard/schedule/ParentWeeklySchedule.tsx
src/app/parent/layout.tsx
src/app/parent/schedule/page.tsx
src/app/parent/students/[id]/grades/page.tsx
src/app/parent/students/[id]/page.tsx
src/app/parent/students/[id]/schedule/page.tsx
src/app/parent/students/page.tsx
src/app/signup/page.tsx
src/app/student/dashboard/announcements/actions.ts
src/app/student/dashboard/announcements/MarkAsReadButton.tsx
src/app/student/dashboard/announcements/page.tsx
src/app/student/dashboard/assignments/[id]/page.tsx
src/app/student/dashboard/assignments/AssignmentDetailsModal.tsx
src/app/student/dashboard/assignments/FileUploadModal.tsx
src/app/student/dashboard/assignments/page.tsx
src/app/student/dashboard/attendance/page.tsx
src/app/student/dashboard/classes/[id]/page.tsx
src/app/student/dashboard/grades/page.tsx
src/app/student/dashboard/layout.tsx
src/app/student/dashboard/materials/page.tsx
src/app/student/dashboard/page.tsx
src/app/student/dashboard/schedule/page.tsx
src/app/student/dashboard/schedule/WeeklySchedule.tsx
src/app/student/layout.tsx
src/app/student/page.tsx
src/app/student/quizzes/[id]/page.tsx
src/app/student/quizzes/page.tsx
src/app/student/subjects/[id]/grades/page.tsx
src/app/student/subjects/[id]/page.tsx
src/app/student/subjects/[id]/participants/page.tsx
src/app/student/subjects/page.tsx
src/app/teacher/assignments/[id]/grading/page.tsx
src/app/teacher/attendance/page.tsx
src/app/teacher/classes/[classId]/announcements/new/page.tsx
src/app/teacher/classes/[classId]/announcements/page.tsx
src/app/teacher/classes/[classId]/assignments/[assignmentId]/page.tsx
src/app/teacher/classes/[classId]/assignments/new/page.tsx
src/app/teacher/classes/[classId]/assignments/page.tsx
src/app/teacher/classes/[classId]/attendance/page.tsx
src/app/teacher/classes/[classId]/materials/new/page.tsx
src/app/teacher/classes/[classId]/materials/page.tsx
src/app/teacher/classes/[classId]/page.tsx
src/app/teacher/classes/[classId]/quizzes/[quizId]/results/page.tsx
src/app/teacher/classes/[classId]/quizzes/new/page.tsx
src/app/teacher/classes/[classId]/students/page.tsx
src/app/teacher/classes/[classId]/tasks/page.tsx
src/app/teacher/classes/page.tsx
src/app/teacher/dashboard/announcements/create/CreateAnnouncementForm.tsx
src/app/teacher/dashboard/announcements/create/page.tsx
src/app/teacher/dashboard/assignments/create/CreateAssignmentForm.tsx
src/app/teacher/dashboard/assignments/create/page.tsx
src/app/teacher/dashboard/layout.tsx
src/app/teacher/dashboard/page.tsx
src/app/teacher/gradebook/[classId]/manage/page.tsx
src/app/teacher/gradebook/[classId]/page.tsx
src/app/teacher/gradebook/page.tsx
src/app/teacher/layout.tsx
src/app/teacher/page.tsx
src/components/admin/CreateUserButton.tsx
src/components/admin/RoleSelector.tsx
src/components/admin/section/CreateSectionButton.tsx
src/components/admin/section/DeleteSectionButton.tsx
src/components/admin/section/EditSectionButton.tsx
src/components/admin/UserAccordionItem.tsx
src/components/AdminNav.tsx
src/components/applicant/ApplicantNav.tsx
src/components/Footer.tsx
src/components/LogoutButton.tsx
src/components/parent/dashboard/AlertList.tsx
src/components/parent/dashboard/AlertSystem.tsx
src/components/parent/dashboard/AttendanceSummary.tsx
src/components/parent/dashboard/IncompleteTasksAlerts.tsx
src/components/parent/dashboard/ParentAssignmentsView.tsx
src/components/parent/dashboard/ParentNav.tsx
src/components/parent/dashboard/ParentWeeklySchedule.tsx
src/components/parent/dashboard/RecentAnnouncements.tsx
src/components/parent/dashboard/StudentOverview.tsx
src/components/parent/dashboard/UpcomingDeadlines.tsx
src/components/providers/auth-provider.tsx
src/components/student/dashboard/assignments/AssignmentHeader.tsx
src/components/student/dashboard/assignments/AssignmentList.tsx
src/components/student/dashboard/assignments/SubmissionStatus.tsx
src/components/student/dashboard/assignments/SubmitWorkForm.tsx
src/components/student/dashboard/classes/ClassAssignments.tsx
src/components/student/dashboard/classes/ClassHeader.tsx
src/components/student/dashboard/classes/ClassProgress.tsx
src/components/student/dashboard/classes/LearningMaterials.tsx
src/components/student/dashboard/ClassProgressGrid.tsx
src/components/student/dashboard/materials/MaterialsLibrary.tsx
src/components/student/dashboard/QuickStats.tsx
src/components/student/dashboard/RecentActivity.tsx
src/components/student/dashboard/RecentActivityFeed.tsx
src/components/student/dashboard/StudentHomePage.tsx
src/components/student/dashboard/StudentNav.tsx
src/components/student/dashboard/subjects/SubjectContent.tsx
src/components/student/dashboard/subjects/SubjectGrades.tsx
src/components/student/dashboard/subjects/SubjectHeader.tsx
src/components/student/dashboard/subjects/SubjectNavigation.tsx
src/components/student/dashboard/subjects/SubjectParticipants.tsx
src/components/student/dashboard/UpcomingDeadlines.tsx
src/components/student/dashboard/UpcomingTasks.tsx
src/components/student/quizzes/QuizStartForm.tsx
src/components/teacher/assignments/AssignmentGradingForm.tsx
src/components/teacher/classes/attendance/AttendanceHistory.tsx
src/components/teacher/classes/attendance/TakeAttendanceForm.tsx
src/components/teacher/gradebook/GradeBookTable.tsx
src/components/teacher/gradebook/ManageGrades.tsx
src/components/teacher/MarkAllPresentButton.tsx
src/components/teacher/TeacherNav.tsx
src/components/ui/accordion.tsx
src/components/ui/badge.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/dialog.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/sonner.tsx
src/components/ui/table.tsx
src/components/ui/textarea.tsx
src/lib/alert-service.ts
src/lib/auth.ts
src/lib/idGenerator.ts
src/lib/prisma.ts
src/lib/session.ts
src/lib/utils.ts
src/lib/validators.ts
test-prisma.ts
tsconfig.json
vercel.json
```

# Files

## File: .eslintrc.json
````json
{
    "extends": "next/core-web-vitals",
    "rules": {
        "@typescript-eslint/no-explicit-any": "off"
    }
}
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
````

## File: eslint.config.mjs
````
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
⋮----
const compat = new FlatCompat({
⋮----
...compat.extends("next/core-web-vitals", "next/typescript"),
````

## File: next-auth.d.ts
````typescript
import NextAuth, { DefaultSession } from "next-auth";
⋮----
interface Session {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            role: string;
            email: string;
        } & DefaultSession["user"];
    }
⋮----
interface User {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        email: string;
    }
⋮----
interface JWT {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        email: string;
    }
````

## File: postcss.config.mjs
````

````

## File: prisma/migrations/20251019182106_add_assignments/migration.sql
````sql
CREATE TYPE "Role" AS ENUM ('APPLICANT', 'STUDENT', 'PARENT', 'TEACHER', 'ADMIN');


CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');


CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');


CREATE TYPE "ApplicantType" AS ENUM ('NEW', 'CONTINUING', 'RETURNEE', 'TRANSFEREE');


CREATE TYPE "MaterialType" AS ENUM ('VIDEO', 'IMAGE', 'DOCUMENT', 'LINK');


CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED');


CREATE TYPE "AssignmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');


CREATE TYPE "SubmissionStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'LATE', 'GRADED');


CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "last_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Applicant" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "ApplicantType" NOT NULL DEFAULT 'NEW',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "applicant_number" TEXT NOT NULL,
    "reference_code" TEXT NOT NULL,
    "personal_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "IdCounter" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdCounter_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "parent_number" TEXT NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "grade_level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "student_number" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "employee_number" TEXT NOT NULL,
    "joined_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "schedule" TEXT,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "graded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "LearningMaterial" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "MaterialType" NOT NULL,
    "url" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "class_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningMaterial_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3) NOT NULL,
    "max_score" INTEGER,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "class_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "assignment_submissions" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "file_url" TEXT,
    "submitted_at" TIMESTAMP(3),
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "score" INTEGER,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_submissions_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "MaterialView" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaterialView_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "class_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "AnnouncementView" (
    "id" TEXT NOT NULL,
    "announcement_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnnouncementView_pkey" PRIMARY KEY ("id")
);


CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


CREATE UNIQUE INDEX "Applicant_user_id_key" ON "Applicant"("user_id");


CREATE UNIQUE INDEX "Applicant_applicant_number_key" ON "Applicant"("applicant_number");


CREATE UNIQUE INDEX "Applicant_reference_code_key" ON "Applicant"("reference_code");


CREATE UNIQUE INDEX "IdCounter_type_year_key" ON "IdCounter"("type", "year");


CREATE UNIQUE INDEX "Parent_user_id_key" ON "Parent"("user_id");


CREATE UNIQUE INDEX "Parent_parent_number_key" ON "Parent"("parent_number");


CREATE UNIQUE INDEX "Student_user_id_key" ON "Student"("user_id");


CREATE UNIQUE INDEX "Student_student_number_key" ON "Student"("student_number");


CREATE UNIQUE INDEX "Teacher_user_id_key" ON "Teacher"("user_id");


CREATE UNIQUE INDEX "Teacher_employee_number_key" ON "Teacher"("employee_number");


CREATE UNIQUE INDEX "Admin_user_id_key" ON "Admin"("user_id");


CREATE UNIQUE INDEX "assignment_submissions_assignment_id_student_id_key" ON "assignment_submissions"("assignment_id", "student_id");


CREATE UNIQUE INDEX "MaterialView_material_id_user_id_key" ON "MaterialView"("material_id", "user_id");


CREATE UNIQUE INDEX "AnnouncementView_announcement_id_user_id_key" ON "AnnouncementView"("announcement_id", "user_id");


ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Parent" ADD CONSTRAINT "Parent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Student" ADD CONSTRAINT "Student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Student" ADD CONSTRAINT "Student_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Class" ADD CONSTRAINT "Class_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Class" ADD CONSTRAINT "Class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Grade" ADD CONSTRAINT "Grade_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Grade" ADD CONSTRAINT "Grade_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Grade" ADD CONSTRAINT "Grade_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Alert" ADD CONSTRAINT "Alert_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Parent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE "assignments" ADD CONSTRAINT "assignments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "assignments" ADD CONSTRAINT "assignments_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "assignment_submissions" ADD CONSTRAINT "assignment_submissions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "MaterialView" ADD CONSTRAINT "MaterialView_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "LearningMaterial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "MaterialView" ADD CONSTRAINT "MaterialView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;


ALTER TABLE "AnnouncementView" ADD CONSTRAINT "AnnouncementView_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "AnnouncementView" ADD CONSTRAINT "AnnouncementView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
````

## File: prisma/migrations/20251021185305_add_assignment_grade_relation/migration.sql
````sql
ALTER TABLE "Grade" ADD COLUMN     "assignment_id" TEXT;


ALTER TABLE "Grade" ADD CONSTRAINT "Grade_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
````

## File: prisma/migrations/20251022142552_add_quiz_system/migration.sql
````sql
CREATE TYPE "QuizType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');


CREATE TYPE "QuizStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');


CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "QuizType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "status" "QuizStatus" NOT NULL DEFAULT 'DRAFT',
    "time_limit" INTEGER,
    "max_attempts" INTEGER NOT NULL DEFAULT 1,
    "due_date" TIMESTAMP(3) NOT NULL,
    "max_score" INTEGER NOT NULL DEFAULT 100,
    "class_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "question_text" TEXT NOT NULL,
    "type" "QuizType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "points" INTEGER NOT NULL DEFAULT 1,
    "options" JSONB NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "score" INTEGER,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" TIMESTAMP(3),
    "time_spent" INTEGER,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_option" TEXT,
    "answer_text" TEXT,
    "is_correct" BOOLEAN,
    "points" INTEGER,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);


CREATE UNIQUE INDEX "quiz_attempts_quiz_id_student_id_key" ON "quiz_attempts"("quiz_id", "student_id");


CREATE UNIQUE INDEX "quiz_answers_attempt_id_question_id_key" ON "quiz_answers"("attempt_id", "question_id");


ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;


ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
````

## File: prisma/migrations/migration_lock.toml
````toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
````

## File: public/file.svg
````
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: public/globe.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: public/next.svg
````
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: public/vercel.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: public/window.svg
````
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: repomix.config.json
````json
{
    "output": {
        "style": "markdown",
        "filePath": "custom-output.md",
        "removeComments": true,
        "compress": true,
        "showLineNumbers": true,
        "topFilesLength": 10
    },
    "ignore": {
        "customPatterns": [
            "*.test.ts",
            "docs/**"
        ]
    }
}
````

## File: src/app/admin/applicants/[id]/approve/approve-form.tsx
````typescript
import { useRouter } from "next/navigation";
import { useState } from "react";
⋮----
interface Parent {
    id: string;
    parentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    students: Array<{ id: string }>;
}
⋮----
interface Section {
    id: string;
    name: string;
    gradeLevel: number;
    students: Array<{ id: string }>;
}
⋮----
interface Applicant {
    id: string;
    applicantNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}
⋮----
interface Props {
    applicant: Applicant;
    parents: Parent[];
    sections: Section[];
}
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) =>
````

## File: src/app/admin/applicants/[id]/approve/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ApproveApplicantForm } from "./approve-form";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
⋮----
export default async function ApproveApplicantPage(
````

## File: src/app/admin/applicants/[id]/reject/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RejectApplicantForm } from "./reject-form";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
⋮----
export default async function RejectApplicantPage(
````

## File: src/app/admin/applicants/[id]/reject/reject-form.tsx
````typescript
import { useRouter } from "next/navigation";
import { useState } from "react";
⋮----
interface Applicant {
    id: string;
    applicantNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}
⋮----
interface Props {
    applicant: Applicant;
}
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
onChange=
````

## File: src/app/admin/applicants/[id]/review/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
⋮----
const calculateAge = (birthdate: Date) =>
````

## File: src/app/admin/applicants/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AdminNav from "@/components/AdminNav";
⋮----
export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/admin/applicants/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
⋮----
interface ApplicantWithUser {
    id: string;
    type: string;
    status: string;
    applicantNumber: string;
    referenceCode: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
        createdAt: Date;
    };
}
⋮----
const getStatusBadge = (status: string) =>
⋮----
const getActionButtons = (applicant: ApplicantWithUser) =>
⋮----
Total:
````

## File: src/app/admin/parents/[id]/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AdminNav from "@/components/AdminNav";
⋮----
export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/admin/parents/[id]/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
⋮----
interface ParentWithDetails {
    id: string;
    parentNumber: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string | null;
        address: string;
        createdAt: Date;
    };
    students: Array<{
        id: string;
        studentNumber: string;
        user: {
            firstName: string;
            lastName: string;
        };
        section: {
            id: string;
            name: string;
            gradeLevel: number;
        };
    }>;
    alerts: Array<{
        id: string;
        message: string;
        createdAt: Date;
        viewed: boolean;
    }>;
}
````

## File: src/app/admin/sections/[id]/students/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
⋮----
interface StudentWithDetails {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
    };
    parent: {
        id: string;
        parentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}
⋮----
interface SectionWithDetails {
    id: string;
    gradeLevel: number;
    name: string;
    students: StudentWithDetails[];
    _count: {
        students: number;
        classes: number;
    };
}
⋮----
const calculateAge = (birthdate: Date) =>
⋮----
const getGenderColor = (gender: string) =>
````

## File: src/app/admin/sections/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AdminNav from "@/components/AdminNav";
⋮----
export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/admin/sections/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import CreateSectionButton from "@/components/admin/section/CreateSectionButton";
import Link from "next/link";
⋮----
interface SectionWithStats {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Array<{ id: string }>;
}
⋮----

⋮----
Avg:
````

## File: src/app/admin/students/[id]/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
⋮----
interface StudentWithDetails {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
        address: string;
        phoneNumber: string | null;
        createdAt: Date;
    };
    parent: {
        id: string;
        parentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string | null;
        };
    };
    section: {
        id: string;
        name: string;
        gradeLevel: number;
    };
    attendance: Array<{
        id: string;
        date: Date;
        status: string;
        class: {
            subjectName: string;
        };
    }>;
    grades: Array<{
        id: string;
        score: number;
        gradedAt: Date;
        class: {
            subjectName: string;
        };
    }>;
}
⋮----
const calculateAge = (birthdate: Date) =>
⋮----
const getAttendanceStats = () =>
⋮----
const getGradeStats = () =>
````

## File: src/app/api/admin/applicants/[id]/reject/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
)
````

## File: src/app/api/admin/parents/[id]/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
)
````

## File: src/app/api/admin/parents/route.ts
````typescript
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function GET()
````

## File: src/app/api/admin/teacher/route.ts
````typescript
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function GET()
````

## File: src/app/api/admin/users/[id]/route.ts
````typescript
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
⋮----
export async function PATCH(req: Request,
````

## File: src/app/api/announcements/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/applicant/status/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function GET(request: NextRequest)
````

## File: src/app/api/assignments/materials/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/assignments/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/attendance/history/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function GET(request: NextRequest)
````

## File: src/app/api/attendance/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function GET(request: NextRequest)
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/cron/generate-alerts/route.ts
````typescript
import { NextResponse } from "next/server";
import { AlertService } from "@/lib/alert-service";
⋮----
export async function GET(request: Request)
````

## File: src/app/api/grades/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/materials/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/quizzes/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentSession } from '@/lib/session';
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/signIn/route.ts
````typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
````

## File: src/app/api/student/assignments/submit/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/teacher/announcements/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/teacher/assignments/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/test-id-generation/route.ts
````typescript
import { NextResponse } from "next/server";
import { generateHumanId } from "@/lib/idGenerator";
⋮----
export async function GET()
````

## File: src/app/api/upload/route.ts
````typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/applicant/portal/application/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Hash,
    FileText,
    Clock,
    GraduationCap
} from "lucide-react";
⋮----
function getAppliedGrade(personalInfo: string | null): string
⋮----
export default async function ApplicationPage()
⋮----
const calculateAge = (birthdate: Date) =>
````

## File: src/app/applicant/portal/profile/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
⋮----
export default async function ProfilePage()
````

## File: src/app/parent/dashboard/assignments/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ParentAssignmentsView } from "./ParentAssignmentsView";
````

## File: src/app/parent/dashboard/assignments/ParentAssignmentsView.tsx
````typescript
import { useState } from "react";
import { Student, Assignment, AssignmentSubmission } from "@prisma/client";
⋮----
interface StudentWithUser extends Student {
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}
⋮----
interface AssignmentWithDetails extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        section: {
            gradeLevel: number;
            name: string;
        };
    };
    submissions: (AssignmentSubmission & {
        student: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    })[];
}
⋮----
interface ParentAssignmentsViewProps {
    students: StudentWithUser[];
    assignments: AssignmentWithDetails[];
}
⋮----
const getSubmissionStatus = (assignment: AssignmentWithDetails, studentId: string) =>
⋮----
const getStatusColor = (status: string) =>
⋮----
const getStatusText = (status: string) =>
⋮----
const getStudentSubmission = (assignment: AssignmentWithDetails, studentId: string) =>
⋮----
const formatDate = (date: Date) =>
⋮----
Due:
⋮----
<div>Submitted:
````

## File: src/app/parent/dashboard/schedule/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ParentWeeklySchedule } from "./ParentWeeklySchedule";
````

## File: src/app/parent/dashboard/schedule/ParentWeeklySchedule.tsx
````typescript
import { useState } from "react";
import { Student } from "@prisma/client";
⋮----
interface ScheduleItem {
    id: string;
    subject: string;
    teacher: string;
    student: {
        id: string;
        name: string;
        gradeLevel: number;
        sectionName: string;
    };
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
        timeRange: string;
    }>;
    schedule: string | null;
}
⋮----
interface ParentWeeklyScheduleProps {
    scheduleData: ScheduleItem[];
    students: Student[];
}
⋮----
const getTodayDayName = () =>
⋮----
const getStudentColor = (studentId: string) =>
⋮----
const getClassesForDay = (day: string) =>
⋮----
const getClassPosition = (startTime: string, endTime: string) =>
⋮----
const getCurrentWeekRange = () =>
````

## File: src/app/parent/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ParentNav } from "@/components/parent/dashboard/ParentNav";
import { Footer } from "@/components/Footer";
⋮----
export default function ParentLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/parent/students/[id]/grades/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, BarChart3 } from "lucide-react";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
⋮----
const getPerformanceColor = (grade: number) =>
⋮----
<Badge className=
⋮----
<p>Date:
````

## File: src/app/parent/students/[id]/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User,
    BookOpen,
    TrendingUp,
    Calendar,
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    School
} from "lucide-react";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
⋮----
interface StudentWithDetails {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        birthdate: Date;
        address: string;
        phoneNumber: string | null;
    };
    section: {
        id: string;
        gradeLevel: number;
        name: string;
    };
    parent: {
        id: string;
        parentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string | null;
        };
    };
    attendance: Array<{
        id: string;
        date: Date;
        status: string;
        class: {
            subjectName: string;
        };
    }>;
    grades: Array<{
        id: string;
        score: number;
        gradedAt: Date;
        class: {
            subjectName: string;
        };
        assignment: {
            title: string;
        } | null;
    }>;
    _count: {
        grades: number;
        attendance: number;
    };
}
⋮----
const calculateAge = (birthdate: Date) =>
⋮----
const getAttendanceStats = () =>
⋮----
const getGradeStats = () =>
⋮----
const getPerformanceColor = (grade: number) =>
⋮----
const getAttendanceColor = (rate: number) =>
````

## File: src/app/parent/students/[id]/schedule/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, BookOpen, User } from "lucide-react";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
⋮----
const getUniqueTeachers = () =>
⋮----
const getNextClass = () =>
⋮----
{/* Right Column - Weekly Schedule */}
````

## File: src/app/student/dashboard/announcements/actions.ts
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function markAnnouncementAsRead(announcementId: string)
````

## File: src/app/student/dashboard/announcements/MarkAsReadButton.tsx
````typescript
import { useTransition } from "react";
import { markAnnouncementAsRead } from "./actions";
⋮----
interface MarkAsReadButtonProps {
    announcementId: string;
}
⋮----
const handleMarkAsRead = () =>
````

## File: src/app/student/dashboard/announcements/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { MarkAsReadButton } from "./MarkAsReadButton";
⋮----
interface AnnouncementWithDetails {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
    class: {
        subjectName: string;
    } | null;
}
⋮----
const getAnnouncementType = (announcement: AnnouncementWithDetails) =>
⋮----
const getTypeColor = (type: string) =>
⋮----
const getTypeIcon = (type: string) =>
⋮----
````

## File: src/app/student/dashboard/assignments/[id]/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssignmentHeader } from "@/components/student/dashboard/assignments/AssignmentHeader";
import { SubmissionStatus } from "@/components/student/dashboard/assignments/SubmissionStatus";
import { SubmitWorkForm } from "@/components/student/dashboard/assignments/SubmitWorkForm";
⋮----
interface PageProps {
  params: {
    id: string;
  };
}
````

## File: src/app/student/dashboard/assignments/AssignmentDetailsModal.tsx
````typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
⋮----
interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
    submissions: Array<{
        id: string;
        status: string;
        submittedAt: Date | null;
        score: number | null;
        feedback: string | null;
        fileUrl: string | null;
    }>;
}
⋮----
interface AssignmentDetailsModalProps {
    assignment: Assignment;
}
⋮----
export function AssignmentDetailsModal(
⋮----
const getStatusColor = (status: string) =>
⋮----
const getStatusText = () =>
⋮----
const formatDate = (date: Date) =>
⋮----
const getTimeRemaining = () =>
⋮----
<p className="text-gray-600">
⋮----
````

## File: src/app/student/dashboard/assignments/FileUploadModal.tsx
````typescript
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
⋮----
interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    class: {
        subjectName: string;
    };
}
⋮----
interface FileUploadModalProps {
    assignment: Assignment;
}
⋮----
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
const getFileTypeIcon = (fileName: string) =>
⋮----
Due:
````

## File: src/app/student/dashboard/attendance/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
⋮----
interface AttendanceRecord {
    id: string;
    date: Date;
    status: string;
    remarks: string | null;
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}
⋮----
````

## File: src/app/student/dashboard/grades/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
⋮----
interface GradeWithDetails {
    id: string;
    score: number;
    remarks: string;
    gradedAt: Date;
    class: {
        id: string;
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}
⋮----
<div className="text-2xl font-bold text-blue-600">
⋮----
<div className="text-2xl font-bold text-purple-600">
````

## File: src/app/student/dashboard/materials/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { MaterialsLibrary } from "@/components/student/dashboard/materials/MaterialsLibrary";
````

## File: src/app/student/dashboard/schedule/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { WeeklySchedule } from "./WeeklySchedule";
````

## File: src/app/student/dashboard/schedule/WeeklySchedule.tsx
````typescript
import { useState } from "react";
⋮----
interface ScheduleItem {
    id: string;
    subject: string;
    teacher: string;
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
        timeRange: string;
    }>;
    schedule: string | null;
}
⋮----
interface WeeklyScheduleProps {
    scheduleData: ScheduleItem[];
}
⋮----
const getTodayDayName = () =>
⋮----
const getClassesForDay = (day: string) =>
⋮----
const getClassPosition = (startTime: string, endTime: string) =>
⋮----
const getCurrentWeekRange = () =>
````

## File: src/app/student/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StudentNav } from "@/components/student/dashboard/StudentNav";
import { Footer } from "@/components/Footer";
⋮----
export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/student/quizzes/[id]/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Calendar,
    FileText,
    AlertTriangle
} from "lucide-react";
import { QuizStartForm } from "@/components/student/quizzes/QuizStartForm";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
````

## File: src/app/student/quizzes/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    BookOpen,
    Clock,
    Calendar,
    CheckCircle2,
    PlayCircle,
    AlertCircle,
    BarChart3,
    FileText
} from "lucide-react";
⋮----
const getQuizStatus = (quiz: any) =>
⋮----
const getTimeRemaining = (dueDate: Date) =>
const now = new Date();
const due = new Date(dueDate);
⋮----

⋮----
<span>Due:
````

## File: src/app/student/subjects/[id]/participants/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
````

## File: src/app/student/subjects/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
⋮----
const normalizedName = subjectName.toLowerCase();
⋮----
function getColorClasses(color: string): string
````

## File: src/app/teacher/assignments/[id]/grading/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AssignmentGradingForm } from "@/components/teacher/assignments/AssignmentGradingForm";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
⋮----
export default async function AssignmentGradingPage(
````

## File: src/app/teacher/attendance/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
interface ClassWithStudents {
    id: string;
    subjectName: string;
    section: {
        id: string;
        name: string;
        gradeLevel: number;
        students: Array<{
            id: string;
            studentNumber: string;
            user: {
                firstName: string;
                lastName: string;
            };
            attendance: Array<{
                date: Date;
                status: string;
            }>;
        }>;
    };
}
⋮----
async function submitAttendance(formData: FormData)
````

## File: src/app/teacher/classes/[classId]/announcements/new/page.tsx
````typescript
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
onChange=
````

## File: src/app/teacher/classes/[classId]/announcements/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    Bell,
    Calendar,
    User,
    Plus,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
⋮----
const getViewRate = (announcement: any) =>
⋮----
const formatDate = (date: Date) =>
````

## File: src/app/teacher/classes/[classId]/assignments/[assignmentId]/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    FileText,
    Calendar,
    Users,
    ArrowLeft,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
        assignmentId: string;
    }>;
}
⋮----
const getAssignmentStatus = () =>
⋮----
const getStatusIcon = (status: string) =>
````

## File: src/app/teacher/classes/[classId]/assignments/new/page.tsx
````typescript
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
⋮----
export default function CreateAssignmentPage()
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
````

## File: src/app/teacher/classes/[classId]/assignments/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    FileText,
    Calendar,
    Users,
    Plus,
    Edit,
    BarChart3,
    Clock,
    CheckCircle2,
    Circle
} from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
⋮----
const getAssignmentStatus = (assignment: any) =>
⋮----
const getStatusIcon = (status: string) =>
⋮----
const getStatusColor = (status: string) =>
⋮----
const getSubmissionRate = (assignment: any) =>
⋮----
const getGradedCount = (assignment: any) =>
⋮----
````

## File: src/app/teacher/classes/[classId]/attendance/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import TakeAttendanceForm from '@/components/teacher/classes/attendance/TakeAttendanceForm';
import AttendanceHistory from '@/components/teacher/classes/attendance/AttendanceHistory';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
⋮----
export default async function TakeAttendancePage(
````

## File: src/app/teacher/classes/[classId]/materials/new/page.tsx
````typescript
import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, File, X, Link as LinkIcon, Video, Image, FileText } from 'lucide-react';
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
⋮----
const handleFileUpload = async (file: File) =>
⋮----
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
const handleDrop = (e: React.DragEvent<HTMLDivElement>) =>
⋮----
const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
⋮----
const removeFile = () =>
⋮----
const getFileIcon = (type: string) =>
⋮----
const formatFileSize = (bytes: number) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
````

## File: src/app/teacher/classes/[classId]/quizzes/[quizId]/results/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    BookOpen,
    Calendar,
    Users,
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
        quizId: string;
    }>;
}
````

## File: src/app/teacher/classes/[classId]/quizzes/new/page.tsx
````typescript
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Plus, Trash2, Clock, Hash, Save, X } from 'lucide-react';
⋮----
interface QuizQuestion {
    id: string;
    order: number;
    questionText: string;
    type: 'MULTIPLE_CHOICE';
    points: number;
    options: {
        id: string;
        text: string;
        isCorrect: boolean;
    }[];
}
⋮----
const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
⋮----
const addQuestion = () =>
⋮----
const updateQuestion = (index: number, field: string, value: any) =>
⋮----
const updateOption = (questionIndex: number, optionIndex: number, field: string, value: any) =>
⋮----
const addOption = (questionIndex: number) =>
⋮----
const removeOption = (questionIndex: number, optionIndex: number) =>
⋮----
const setCorrectAnswer = (questionIndex: number, optionIndex: number) =>
⋮----
// Set all options to false first
⋮----
// Set the selected option as correct
⋮----
const removeQuestion = (index: number) =>
⋮----
// Update order numbers
⋮----
const moveQuestion = (index: number, direction: 'up' | 'down') =>
⋮----
const validateQuiz = () =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
onChange=
````

## File: src/app/teacher/classes/[classId]/students/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import { Mail, Phone } from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
⋮----
const calculateStudentAverage = (grades: any[]) =>
````

## File: src/app/teacher/classes/[classId]/tasks/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    FileText,
    Calendar,
    Users,
    Plus,
    Edit,
    BarChart3,
    Clock,
    CheckCircle2,
    Circle,
    BookOpen,
    Eye
} from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
⋮----
const getTaskStatus = (task: any) =>
⋮----
const getStatusIcon = (status: string) =>
⋮----
const getStatusColor = (status: string) =>
⋮----
const getTypeColor = (type: string) =>
⋮----
const getTypeIcon = (type: string) =>
⋮----
const getSubmissionRate = (task: any) =>
⋮----
Created:
⋮----
````

## File: src/app/teacher/dashboard/announcements/create/CreateAnnouncementForm.tsx
````typescript
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
⋮----
interface TeacherWithClasses {
    id: string;
    classes: Array<{
        id: string;
        subjectName: string;
        section: {
            gradeLevel: number;
            name: string;
        };
    }>;
}
⋮----
interface CreateAnnouncementFormProps {
    teacher: TeacherWithClasses;
    classes: TeacherWithClasses["classes"];
}
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
⋮----
const handleContentChange = (value: string = "") =>
⋮----
const stripHtml = (html: string) =>
⋮----
const getPlainTextPreview = (content: string) =>
⋮----
// Simple markdown to plain text conversion
⋮----
.replace(/#{1,6}\s?/g, '') // Remove headers
.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
.replace(/\*(.*?)\*/g, '$1') // Remove italic
.replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links but keep text
.replace(/\n/g, ' ') // Replace newlines with spaces
⋮----
{/* Title */}
````

## File: src/app/teacher/dashboard/announcements/create/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CreateAnnouncementForm } from "./CreateAnnouncementForm";
````

## File: src/app/teacher/dashboard/assignments/create/CreateAssignmentForm.tsx
````typescript
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
⋮----
interface TeacherWithClasses {
    id: string;
    classes: Array<{
        id: string;
        subjectName: string;
        section: {
            gradeLevel: number;
            name: string;
        };
    }>;
}
⋮----
interface CreateAssignmentFormProps {
    teacher: TeacherWithClasses;
    classes: TeacherWithClasses["classes"];
}
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
⋮----
{/* Assignment Title */}
⋮----
<Label htmlFor="maxScore">Maximum Score (Optional)</Label>
````

## File: src/app/teacher/dashboard/assignments/create/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { CreateAssignmentForm } from "./CreateAssignmentForm";
````

## File: src/app/teacher/dashboard/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
⋮----
export default function TeacherDashboardLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/teacher/gradebook/[classId]/manage/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import ManageGrades from '@/components/teacher/gradebook/ManageGrades';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
````

## File: src/app/teacher/gradebook/[classId]/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import GradebookTable from '@/components/teacher/gradebook/GradeBookTable';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
````

## File: src/app/teacher/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
````

## File: src/components/admin/RoleSelector.tsx
````typescript
import { useState } from "react";
⋮----
export default function RoleSelector(
⋮----
const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) =>
````

## File: src/components/admin/section/DeleteSectionButton.tsx
````typescript
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
⋮----
interface Section {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Array<{ id: string }>;
}
⋮----
interface DeleteSectionButtonProps {
    section: Section;
    onSectionDeleted: () => void;
}
⋮----
const handleDelete = async () =>
````

## File: src/components/admin/section/EditSectionButton.tsx
````typescript
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
⋮----
interface Section {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Array<{ id: string }>;
}
⋮----
interface EditSectionButtonProps {
    section: Section;
    onSectionUpdated: () => void;
}
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
````

## File: src/components/admin/UserAccordionItem.tsx
````typescript
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { useState } from "react";
import RoleSelector from "@/components/admin/RoleSelector";
import { cn } from "@/lib/utils";
⋮----
interface UserAccordionItemProps {
    user: {
        id: string;
        firstName: string;
        middleName?: string | null;
        lastName: string;
        email: string;
        gender?: string | null;
        address?: string | null;
        phoneNumber?: string | null;
        birthdate?: Date | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
⋮----
e.stopPropagation();
setOpen((prev)
````

## File: src/components/applicant/ApplicantNav.tsx
````typescript
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import {
    User,
    FileText,
    Home,
    Clock
} from "lucide-react";
````

## File: src/components/Footer.tsx
````typescript
export function Footer()
````

## File: src/components/parent/dashboard/AlertList.tsx
````typescript
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Info, BookOpen, User, X } from "lucide-react";
⋮----
interface Alert {
    id: string;
    message: string;
    viewed: boolean;
    createdAt: Date;
    type: 'OVERDUE_ASSIGNMENT' | 'GRADE_POSTED' | 'ATTENDANCE_ISSUE';
}
⋮----
interface AlertListProps {
    alerts: Alert[];
    parentId: string;
}
⋮----
const markAsViewed = async (alertId: string) =>
⋮----
const getAlertIcon = (type: Alert['type']) =>
⋮----
const getAlertVariant = (type: Alert['type']) =>
⋮----
const getTypeText = (type: Alert['type']) =>
⋮----
<Badge variant=
````

## File: src/components/parent/dashboard/IncompleteTasksAlerts.tsx
````typescript
import { Student, Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
⋮----
interface StudentWithUser extends Student {
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}
⋮----
interface AssignmentWithDetails extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
    submissions: AssignmentSubmission[];
}
⋮----
interface IncompleteTasksAlertsProps {
    students: StudentWithUser[];
    assignments: AssignmentWithDetails[];
}
⋮----
{/* Overdue Assignments */}
⋮----
{/* Due Soon Assignments */}
⋮----
{dueSoon.map(assignment => {
                                                const dueDate = new Date(assignment.dueDate);
````

## File: src/components/parent/dashboard/ParentAssignmentsView.tsx
````typescript
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Calendar, User, BookOpen, Search, Filter, Download, Eye } from "lucide-react";
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        id: string;
        gradeLevel: number;
        name: string;
    };
}
⋮----
interface Assignment {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    class: {
        id: string;
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        section: {
            id: string;
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        id: string;
        studentId: string;
        status: string;
        submittedAt: Date | null;
        score: number | null;
        feedback: string | null;
    }>;
}
⋮----
interface ParentAssignmentsViewProps {
    students: Student[];
    assignments: Assignment[];
}
⋮----
type FilterType = 'all' | 'overdue' | 'due-this-week' | 'submitted' | 'not-submitted';
type SortType = 'due-date' | 'subject' | 'student' | 'status';
⋮----
const getDaysUntilDue = (dueDate: Date): string =>
⋮----
const getUrgencyColor = (dueDate: Date) =>
⋮----
const getSubmissionStatus = (assignment: Assignment, studentId: string) =>
⋮----
const getOverallStatus = (assignment: Assignment): string =>
⋮----
const getStatusColor = (status: string) =>
⋮----
const getStatusText = (status: string) =>
⋮----
const getStudentForAssignment = (assignment: Assignment) =>
⋮----
<Badge className=
⋮----
````

## File: src/components/parent/dashboard/ParentWeeklySchedule.tsx
````typescript
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, User, BookOpen } from "lucide-react";
⋮----
interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}
⋮----
interface ScheduleItem {
    id: string;
    subject: string;
    teacher: string;
    student: {
        id: string;
        name: string;
        gradeLevel: number;
        sectionName: string;
    };
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
        timeRange: string;
    }>;
    schedule: string | null;
}
⋮----
interface ParentWeeklyScheduleProps {
    scheduleData: ScheduleItem[];
    students: Student[];
}
⋮----
const getStudentColor = (studentId: string) =>
⋮----
const getClassesForDayAndTime = (day: string, timeSlot: string) =>
⋮----
const getClassPosition = (startTime: string, endTime: string) =>
⋮----
const navigateWeek = (direction: 'prev' | 'next') =>
⋮----
const getCurrentWeekRange = () =>
⋮----
const shouldRenderClass = (classItem: ScheduleItem, day: string, gridTime: string) =>
⋮----

⋮----
style=
````

## File: src/components/parent/dashboard/UpcomingDeadlines.tsx
````typescript
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle, FileText, BookOpen } from "lucide-react";
⋮----
interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}
⋮----
interface Assignment {
    id: string;
    title: string;
    description?: string | null;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        section: {
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        studentId: string;
        status: string;
        submittedAt: Date | null;
    }>;
}
⋮----
interface UpcomingDeadlinesProps {
    assignments: Assignment[];
    students: Student[];
}
⋮----
const getDaysUntilDue = (dueDate: Date): string =>
⋮----
const getUrgencyColor = (dueDate: Date, isOverdue: boolean = false) =>
⋮----
const getSubmissionStatus = (assignment: Assignment, studentId: string) =>
⋮----
const getStudentForAssignment = (assignment: Assignment) =>
````

## File: src/components/providers/auth-provider.tsx
````typescript
import { SessionProvider } from 'next-auth/react';
⋮----
export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/components/student/dashboard/assignments/AssignmentHeader.tsx
````typescript
import { Assignment } from "@prisma/client";
⋮----
interface AssignmentWithClass extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}
⋮----
interface AssignmentHeaderProps {
    assignment: AssignmentWithClass;
    isPastDue: boolean;
}
⋮----
const getUrgencyColor = () =>
⋮----
const getUrgencyText = () =>
````

## File: src/components/student/dashboard/assignments/AssignmentList.tsx
````typescript
import { useState } from "react";
import { Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";
⋮----
interface AssignmentWithDetails extends Assignment {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
    submissions: AssignmentSubmission[];
}
⋮----
interface AssignmentListProps {
    upcomingAssignments: AssignmentWithDetails[];
    submittedAssignments: AssignmentWithDetails[];
    missedAssignments: AssignmentWithDetails[];
}
⋮----
const getAssignmentStatus = (assignment: AssignmentWithDetails) =>
⋮----
const getStatusColor = (status: string) =>
⋮----
const getStatusText = (status: string) =>
⋮----
const getStatusIcon = (status: string) =>
⋮----
const getDaysUntilDue = (dueDate: Date): string =>
⋮----
const canSubmit = (assignment: AssignmentWithDetails) =>
⋮----

⋮----
Due:
````

## File: src/components/student/dashboard/assignments/SubmissionStatus.tsx
````typescript
import { Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";
⋮----
interface AssignmentWithClass extends Assignment {
  class: {
    subjectName: string;
  };
}
⋮----
interface SubmissionStatusProps {
  assignment: AssignmentWithClass;
  submission: AssignmentSubmission | undefined;
  studentId: string;
}
⋮----
const getStatusInfo = () =>
````

## File: src/components/student/dashboard/assignments/SubmitWorkForm.tsx
````typescript
import { useState } from "react";
import { Assignment } from "@prisma/client";
import { useRouter } from "next/navigation";
⋮----
interface SubmitWorkFormProps {
    assignment: Assignment;
    studentId: string;
}
⋮----
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
````

## File: src/components/student/dashboard/classes/ClassAssignments.tsx
````typescript
import { Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";
⋮----
interface AssignmentWithSubmissions extends Assignment {
    submissions: AssignmentSubmission[];
}
⋮----
interface ClassAssignmentsProps {
    assignments: AssignmentWithSubmissions[];
    studentId: string;
}
⋮----
const getStatus = (assignment: AssignmentWithSubmissions) =>
⋮----
<span>Due:
````

## File: src/components/student/dashboard/classes/ClassHeader.tsx
````typescript
import { Class } from "@prisma/client";
⋮----
interface ClassWithTeacher extends Class {
    teacher: {
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}
⋮----
interface ClassHeaderProps {
    classItem: ClassWithTeacher;
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
}
⋮----
const getClassIcon = (subjectName: string) =>
⋮----
const getClassColor = (subjectName: string) =>
⋮----
const getProgressColor = (progress: number) =>
⋮----
const getProgressIcon = (progress: number) =>
````

## File: src/components/student/dashboard/classes/ClassProgress.tsx
````typescript
interface ClassProgressProps {
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    materialsCount: number;
}
⋮----
export function ClassProgress(
````

## File: src/components/student/dashboard/classes/LearningMaterials.tsx
````typescript
import { LearningMaterial, MaterialType } from "@prisma/client";
⋮----
interface LearningMaterialsProps {
    materials: LearningMaterial[];
    classId: string;
}
⋮----
const getMaterialIcon = (type: MaterialType) =>
````

## File: src/components/student/dashboard/ClassProgressGrid.tsx
````typescript
import Link from "next/link";
⋮----
interface Class {
    id: string;
    name: string;
    teacher: string;
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    resourceCount: number;
    upcomingAssignments: Array<{
        id: string;
        title: string;
        dueDate: Date;
    }>;
    color: string;
}
⋮----
interface ClassProgressGridProps {
    classes: Class[];
}
⋮----
const getColorClasses = (color: string) =>
⋮----
const getProgressColor = (progress: number) =>
⋮----
const getClassIcon = (className: string) =>
⋮----
````

## File: src/components/student/dashboard/materials/MaterialsLibrary.tsx
````typescript
import { useState } from "react";
import { LearningMaterial, MaterialType } from "@prisma/client";
⋮----
interface MaterialWithClass extends LearningMaterial {
    class: {
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}
⋮----
interface MaterialsLibraryProps {
    materialsByClass: Record<string, MaterialWithClass[]>;
}
⋮----
const getMaterialIcon = (type: MaterialType) =>
⋮----
const getMaterialColor = (type: MaterialType) =>
⋮----
const getMaterialTypeText = (type: MaterialType) =>
⋮----
const getFileType = (url: string) =>
⋮----
onChange=
````

## File: src/components/student/dashboard/QuickStats.tsx
````typescript
interface Class {
    id: string;
    name: string;
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    resourceCount: number;
}
⋮----
interface QuickStatsProps {
    classes: Class[];
}
⋮----
const getColorClasses = (color: string) =>
````

## File: src/components/student/dashboard/RecentActivity.tsx
````typescript
import Link from "next/link";
⋮----
interface Activity {
    id: string;
    type: 'ANNOUNCEMENT' | 'MATERIAL' | 'GRADE' | 'SUBMISSION';
    title: string;
    description: string;
    subject: string;
    timestamp: Date;
    link: string;
}
⋮----
interface RecentActivityProps {
    activities: Activity[];
}
⋮----
const getActivityIcon = (type: string) =>
⋮----
const getActivityColor = (type: string) =>
⋮----
const formatTimeAgo = (date: Date): string =>
````

## File: src/components/student/dashboard/RecentActivityFeed.tsx
````typescript
import Link from "next/link";
import { Announcement } from "@prisma/client";
⋮----
interface AnnouncementWithDetails extends Announcement {
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
    class: {
        subjectName: string;
    } | null;
}
⋮----
interface RecentActivityFeedProps {
    announcements: AnnouncementWithDetails[];
    studentId: string;
}
⋮----
const getActivityIcon = (type: string) =>
⋮----
const getActivityColor = (type: string) =>
⋮----
const formatTimeAgo = (date: Date): string =>
⋮----
const formatContentPreview = (content: string, maxLength: number = 80): string =>
⋮----
// Convert announcements to activity items
⋮----
// Add some mock activities for demonstration (in a real app, these would come from the database)
⋮----
timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
⋮----
timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
⋮----
{/* Activity Icon */}
````

## File: src/components/student/dashboard/StudentHomePage.tsx
````typescript
import { useState, useMemo } from "react";
import Link from "next/link";
⋮----
interface ClassWithProgress {
    id: string;
    subjectName: string;
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
    progress: number;
    totalAssignments: number;
    submittedAssignments: number;
    recentActivity: Date | null;
    color: string;
}
⋮----
interface StudentHomePageProps {
    classes: ClassWithProgress[];
    studentName: string;
    gradeLevel: number;
    sectionName: string;
}
⋮----
onChange=
⋮----
{/* Progress Bar */}
⋮----
{/* Stats */}
⋮----
{/* Total Stats (Always show overall stats) */}
⋮----
// Helper functions for client component
````

## File: src/components/student/dashboard/subjects/SubjectContent.tsx
````typescript
import Link from "next/link";
⋮----
interface SubjectContentProps {
    classData: any;
    studentId: string;
    grades: any[];
}
⋮----
````

## File: src/components/student/dashboard/subjects/SubjectHeader.tsx
````typescript
interface SubjectHeaderProps {
    classData: any;
    student: any;
    gradeStats: {
        average: number;
        highest: number;
        lowest: number;
        total: number;
        completed: number;
    };
}
⋮----
export function SubjectHeader(
⋮----
function getColorClasses(color: string): string
````

## File: src/components/student/dashboard/subjects/SubjectParticipants.tsx
````typescript
import Link from "next/link";
⋮----
interface SubjectParticipantsProps {
    participants: any[];
    teacher: any;
    classId: string;
}
````

## File: src/components/student/dashboard/UpcomingDeadlines.tsx
````typescript
import Link from "next/link";
import { Assignment } from "@prisma/client";
⋮----
interface AssignmentWithClass extends Assignment {
    className: string;
    classColor: string;
    class: {
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    };
}
⋮----
interface UpcomingDeadlinesProps {
    assignments: AssignmentWithClass[];
}
⋮----
const getColorClasses = (color: string) =>
⋮----
const getDaysUntilDue = (dueDate: Date): string =>
⋮----
const getUrgencyColor = (dueDate: Date): string =>
⋮----
Due:
````

## File: src/components/student/dashboard/UpcomingTasks.tsx
````typescript
import Link from "next/link";
⋮----
interface Task {
    id: string;
    title: string;
    type: 'ASSIGNMENT' | 'QUIZ';
    dueDate: Date;
    subject: string;
    subjectColor: string;
    status: 'PENDING' | 'SUBMITTED' | 'OVERDUE';
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}
⋮----
interface UpcomingTasksProps {
    tasks: Task[];
}
⋮----
const getPriorityColor = (priority: string) =>
⋮----
const getStatusIcon = (status: string) =>
⋮----
const getTypeIcon = (type: string) =>
````

## File: src/components/student/quizzes/QuizStartForm.tsx
````typescript
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Clock,
    FileText,
    AlertTriangle,
    CheckCircle2,
    BookOpen
} from "lucide-react";
⋮----
interface QuizStartFormProps {
    quiz: any;
    studentId: string;
}
⋮----
export function QuizStartForm(
⋮----
const handleStartQuiz = async () =>
````

## File: src/components/teacher/assignments/AssignmentGradingForm.tsx
````typescript
import { useState } from "react";
import { useRouter } from "next/navigation";
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
    submissions: Array<{
        id: string;
        fileUrl: string | null;
        submittedAt: Date | null;
        status: string;
    }>;
    grades: Array<{
        id: string;
        score: number;
        remarks: string;
    }>;
}
⋮----
interface Assignment {
    id: string;
    title: string;
    description: string | null;
    maxScore: number | null;
    dueDate: Date;
    class: {
        id: string;
        subjectName: string;
        section: {
            name: string;
            gradeLevel: number;
        };
    };
}
⋮----
interface AssignmentGradingFormProps {
    assignment: Assignment;
    students: Student[];
}
⋮----
const handleGradeChange = (studentId: string, field: string, value: string) =>
⋮----
const handleSubmitGrade = async (studentId: string) =>
⋮----
const handleBulkSubmit = async () =>
⋮----
const getExistingGrade = (student: Student) =>
⋮----
const getSubmissionStatus = (student: Student) =>
⋮----
disabled=
⋮----
onChange=
````

## File: src/components/teacher/classes/attendance/AttendanceHistory.tsx
````typescript
import { useState, useEffect } from 'react';
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}
⋮----
interface AttendanceRecord {
    id: string;
    date: Date;
    status: string;
    studentId: string;
    student: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
}
⋮----
interface Props {
    classId: string;
    students: Student[];
    availableDates: Date[];
}
⋮----
const fetchAttendanceData = async () =>
⋮----
const getStatusColor = (status: string) =>
⋮----
const getStatusCount = (date: Date, status: string) =>
⋮----
<div key=
⋮----
P:
⋮----
A:
````

## File: src/components/teacher/classes/attendance/TakeAttendanceForm.tsx
````typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}
⋮----
interface Props {
    classId: string;
    teacherId: string;
    students: Student[];
    existingDates: Date[];
}
⋮----
const loadAttendanceForDate = async () =>
⋮----
const handleStatusChange = (studentId: string, status: string) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
const getStatusColor = (status: string) =>
⋮----
const getStatusCount = (status: string) =>
⋮----
const navigateDate = (days: number) =>
````

## File: src/components/teacher/gradebook/GradeBookTable.tsx
````typescript
import { useState } from 'react';
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
    grades: Array<{
        id: string;
        score: number;
        assignment: {
            id: string;
            title: string;
            maxScore: number | null;
        } | null;
    }>;
}
⋮----
interface Assignment {
    id: string;
    title: string;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    submissions: Array<{
        id: string;
    }>;
}
⋮----
interface Props {
    students: Student[];
    assignments: Assignment[];
    classId: string;
}
⋮----
const calculateStudentAverage = (student: Student) =>
⋮----
const getGradeForAssignment = (student: Student, assignmentId: string) =>
⋮----
const getGradeColor = (score: number, maxScore: number | null) =>
⋮----
const getAverageColor = (average: number) =>
````

## File: src/components/teacher/gradebook/ManageGrades.tsx
````typescript
import { useState } from 'react';
import { useRouter } from 'next/navigation';
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
    grades: Array<{
        id: string;
        score: number;
        assignmentId: string | null;
        remarks?: string | null;
    }>;
}
⋮----
interface Assignment {
    id: string;
    title: string;
    dueDate: Date;
    maxScore: number | null;
}
⋮----
interface Props {
    classId: string;
    students: Student[];
    assignments: Assignment[];
}
⋮----
export default function ManageGrades(
⋮----
const handleGradeChange = (studentId: string, value: string) =>
⋮----
const handleRemarksChange = (studentId: string, value: string) =>
⋮----
const handleSubmit = async () =>
⋮----
const getExistingGrade = (student: Student, assignmentId: string) =>
⋮----

⋮----
onChange=
````

## File: src/components/teacher/MarkAllPresentButton.tsx
````typescript
interface MarkAllPresentButtonProps {
    classId: string;
}
⋮----
export function MarkAllPresentButton(
⋮----
const markAllPresent = () =>
````

## File: src/components/teacher/TeacherNav.tsx
````typescript
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
````

## File: src/components/ui/accordion.tsx
````typescript
import { ChevronDownIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>)
⋮----
function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>)
⋮----
className=
⋮----
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>)
````

## File: src/components/ui/badge.tsx
````typescript
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
⋮----
export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }
⋮----
function Badge(
````

## File: src/components/ui/button.tsx
````typescript
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
⋮----
import { cn } from "@/lib/utils"
````

## File: src/components/ui/card.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
function CardContent(
````

## File: src/components/ui/dialog.tsx
````typescript
import { XIcon } from "lucide-react"
⋮----
import { cn } from "@/lib/utils"
⋮----
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>)
⋮----
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>)
⋮----
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>)
⋮----
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>)
````

## File: src/components/ui/input.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
function Input(
⋮----
className=
````

## File: src/components/ui/label.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/components/ui/sonner.tsx
````typescript
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
⋮----
const Toaster = (
````

## File: src/components/ui/table.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
function Table(
⋮----
className=
````

## File: src/components/ui/textarea.tsx
````typescript
import { cn } from "@/lib/utils"
⋮----
className=
````

## File: src/lib/session.ts
````typescript
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
⋮----
export async function getCurrentSession(): Promise<Session | null>
⋮----
export async function requireSession(allowedRoles?: string | string[]): Promise<Session>
⋮----
export async function redirectToDashboard(role: string)
````

## File: src/lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
⋮----
export function cn(...inputs: ClassValue[])
````

## File: src/lib/validators.ts
````typescript
import { z } from "zod";
⋮----
export type LoginInput = z.infer<typeof LoginSchema>;
````

## File: test-prisma.ts
````typescript
import prisma from "./src/lib/prisma";
⋮----
async function main()
````

## File: vercel.json
````json
{
    "crons": [
        {
            "path": "/api/cron/generate-alerts",
            "schedule": "0 8 * * *"
        }
    ]
}
````

## File: next.config.ts
````typescript
import type { NextConfig } from "next";
````

## File: README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# LearnScape LMS"
````

## File: src/app/admin/dashboard/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AdminNav from "@/components/AdminNav";
⋮----
export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/admin/dashboard/page.tsx
````typescript
import prisma from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Accordion } from "@/components/ui/accordion";
import CreateUserButton from "@/components/admin/CreateUserButton";
import UserAccordionItem from "@/components/admin/UserAccordionItem";
````

## File: src/app/api/admin/applicants/[id]/approve/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { generateHumanId } from "@/lib/idGenerator";
import prisma from "@/lib/prisma";
⋮----
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
)
````

## File: src/app/api/admin/sections/[id]/classes/[classId]/route.ts
````typescript
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
interface RouteParams {
    params: {
        id: string;
        classId: string;
    };
}
⋮----
export async function PUT(request: Request,
⋮----
export async function DELETE(request: Request,
````

## File: src/app/api/admin/students/[id]/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
)
⋮----
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
)
````

## File: src/app/api/admin/users/route.ts
````typescript
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateHumanId } from "@/lib/idGenerator";
import prisma from "@/lib/prisma";
⋮----
export async function POST(req: Request)
````

## File: src/app/applicant/portal/layout.tsx
````typescript
import type { Metadata } from "next";
import { ApplicantNav } from "@/components/applicant/ApplicantNav";
import { Footer } from "@/components/Footer"
⋮----
export default function ApplicantPortalLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/parent/alerts/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { AlertService } from "@/lib/alert-service";
import { AlertList } from "@/components/parent/dashboard/AlertList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertTriangle, Info } from "lucide-react";
⋮----
<form action=
````

## File: src/app/parent/assignments/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParentAssignmentsView } from "@/components/parent/dashboard/ParentAssignmentsView";
import { FileText, Calendar, AlertTriangle, CheckCircle2, Clock, BookOpen } from "lucide-react";
⋮----
interface StudentWithUser {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        id: string;
        gradeLevel: number;
        name: string;
    };
}
⋮----
interface AssignmentWithDetails {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    maxScore: number | null;
    status: string;
    class: {
        id: string;
        subjectName: string;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        section: {
            id: string;
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        id: string;
        studentId: string;
        status: string;
        submittedAt: Date | null;
        score: number | null;
        feedback: string | null;
    }>;
}
⋮----
const getAssignmentStats = () =>
⋮----
const getAssignmentsByStatus = () =>
````

## File: src/app/parent/schedule/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParentWeeklySchedule } from "@/components/parent/dashboard/ParentWeeklySchedule";
import { Calendar, Clock, Users, BookOpen, School } from "lucide-react";
⋮----
interface StudentWithClasses {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
    classes: Array<{
        id: string;
        subjectName: string;
        schedule: string | null;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
    }>;
}
⋮----
interface ScheduleItem {
    id: string;
    subject: string;
    teacher: string;
    student: {
        id: string;
        name: string;
        gradeLevel: number;
        sectionName: string;
    };
    timeSlots: Array<{
        day: string;
        startTime: string;
        endTime: string;
        timeRange: string;
    }>;
    schedule: string | null;
}
⋮----
const parseSchedule = (schedule: string): Array<
⋮----
const convertTo24Hour = (time12: string): string =>
⋮----
const parseScheduleData = (): ScheduleItem[] =>
⋮----
const getScheduleStats = () =>
````

## File: src/app/parent/students/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
⋮----
interface StudentWithDetails {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
    attendance: Array<{
        date: Date;
        status: string;
    }>;
    grades: Array<{
        score: number;
        class: {
            subjectName: string;
        };
    }>;
    _count: {
        grades: number;
        attendance: number;
    };
}
⋮----
const getStudentStats = (student: StudentWithDetails) =>
⋮----
const getPerformanceColor = (grade: number) =>
⋮----
const getAttendanceColor = (rate: number) =>
````

## File: src/app/student/dashboard/classes/[id]/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassHeader } from "@/components/student/dashboard/classes/ClassHeader";
import { LearningMaterials } from "@/components/student/dashboard/classes/LearningMaterials";
import { ClassAssignments } from "@/components/student/dashboard/classes/ClassAssignments";
import { ClassProgress } from "@/components/student/dashboard/classes/ClassProgress";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
````

## File: src/app/student/dashboard/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
⋮----
export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
})
````

## File: src/app/student/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import StudentHomePage from "@/components/student/dashboard/StudentHomePage";
⋮----
export default async function StudentHomePageWrapper()
⋮----
function getClassColor(subjectName: string): string
````

## File: src/app/student/subjects/[id]/grades/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
⋮----
interface PageProps {
    params: {
        id: string;
    };
}
````

## File: src/app/student/subjects/[id]/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SubjectHeader } from "@/components/student/dashboard/subjects/SubjectHeader";
import { SubjectNavigation } from "@/components/student/dashboard/subjects/SubjectNavigation";
import { SubjectContent } from "@/components/student/dashboard/subjects/SubjectContent";
import { SubjectParticipants } from "@/components/student/dashboard/subjects/SubjectParticipants";
import { SubjectGrades } from "@/components/student/dashboard/subjects/SubjectGrades";
⋮----
interface PageProps {
    params: {
        id: string;
    };
    searchParams: {
        tab?: string;
    };
}
⋮----
export default async function SubjectPage(
⋮----
const renderContent = () =>
⋮----
function calculateGradeStats(grades: any[])
⋮----
function calculatePercentage(score: number, maxScore: number): number
````

## File: src/app/teacher/classes/[classId]/materials/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import { File, Image, Video, Link as LinkIcon, Download, Eye, Plus } from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
⋮----
const getMaterialIcon = (type: string) =>
⋮----
const getTypeColor = (type: string) =>
````

## File: src/app/teacher/classes/[classId]/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
import {
    BookOpen,
    Users,
    Calendar,
    BarChart3,
    Bell,
    FileText,
    PlusCircle,
    Clock,
    CheckCircle2
} from 'lucide-react';
⋮----
interface Props {
    params: Promise<{
        classId: string;
    }>;
}
⋮----
export default async function ManageClassPage(
⋮----
<span>Due:
````

## File: src/app/teacher/gradebook/page.tsx
````typescript
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import Link from 'next/link';
````

## File: src/app/teacher/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TeacherNav } from "@/components/teacher/TeacherNav";
import { Footer } from "@/components/Footer";
⋮----
export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
})
````

## File: src/components/admin/CreateUserButton.tsx
````typescript
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
⋮----
interface Parent {
    id: string;
    parentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}
⋮----
interface Section {
    id: string;
    name: string;
    gradeLevel: number;
}
⋮----
// Fetch parents and sections when dialog opens
⋮----
const fetchParentsAndSections = async () =>
⋮----
// You might want to create API endpoints for these
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
window.location.reload(); // reload table
⋮----
const resetForm = () =>
⋮----
setOpen(isOpen);
````

## File: src/components/admin/section/CreateSectionButton.tsx
````typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
window.location.reload(); // Refresh to show new section
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
````

## File: src/components/LogoutButton.tsx
````typescript
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
⋮----
export default function LogoutButton()
````

## File: src/components/parent/dashboard/AlertSystem.tsx
````typescript
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
⋮----
interface Alert {
    id: string;
    message: string;
    viewed: boolean;
    createdAt: Date;
}
⋮----
interface AlertSystemProps {
    parentId: string;
    initialAlerts: Alert[];
}
⋮----
const markAsViewed = async (alertId: string) =>
⋮----
const markAllAsViewed = async () =>
⋮----
const getAlertIcon = (message: string) =>
⋮----
const getAlertVariant = (message: string) =>
````

## File: src/components/parent/dashboard/AttendanceSummary.tsx
````typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
⋮----
interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    attendance: Array<{
        date: Date;
        status: string;
    }>;
}
⋮----
interface AttendanceSummaryProps {
    students: Student[];
}
⋮----
const getAttendanceStats = (student: Student) =>
⋮----
const getOverallStats = () =>
⋮----
const getRateColor = (rate: number) =>
⋮----
const getRateBgColor = (rate: number) =>
````

## File: src/components/parent/dashboard/ParentNav.tsx
````typescript
import Link from "next/link";
import { getCurrentSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import {
    Home,
    Users,
    Calendar,
    FileText,
    Bell,
    School
} from "lucide-react";
import { AlertService } from "@/lib/alert-service";
⋮----
className=
````

## File: src/components/parent/dashboard/RecentAnnouncements.tsx
````typescript
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Megaphone, BookOpen, School, Calendar } from "lucide-react";
⋮----
interface Student {
    id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
}
⋮----
interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    teacher: {
        user: {
            firstName: string;
            lastName: string;
        };
    };
    class: {
        subjectName: string;
        section: {
            gradeLevel: number;
            name: string;
        };
    } | null;
}
⋮----
interface RecentAnnouncementsProps {
    announcements: Announcement[];
    students: Student[];
}
⋮----
const getAnnouncementType = (announcement: Announcement) =>
⋮----
const getTypeIcon = (type: string) =>
⋮----
const getTypeColor = (type: string) =>
⋮----
const getTypeText = (type: string) =>
⋮----
const isRelevantToStudent = (announcement: Announcement, student: Student) =>
⋮----
const getRelevantStudents = (announcement: Announcement) =>
⋮----
const formatContentPreview = (content: string, maxLength: number = 100): string =>
⋮----
const formatTimeAgo = (date: Date): string =>
⋮----
````

## File: src/components/parent/dashboard/StudentOverview.tsx
````typescript
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, TrendingUp, AlertTriangle } from "lucide-react";
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    section: {
        gradeLevel: number;
        name: string;
    };
    attendance: Array<{
        date: Date;
        status: string;
    }>;
    grades: Array<{
        score: number;
        class: {
            subjectName: string;
        };
    }>;
}
⋮----
interface Assignment {
    id: string;
    title: string;
    description?: string | null;
    dueDate: Date;
    class: {
        subjectName: string;
        section: {
            gradeLevel: number;
            name: string;
        };
    };
    submissions: Array<{
        studentId: string;
        status: string;
    }>;
}
⋮----
interface StudentOverviewProps {
    students: Student[];
    assignments: Assignment[];
}
⋮----
const getStudentStats = (student: Student) =>
⋮----
const getPerformanceColor = (grade: number) =>
⋮----
const getAttendanceColor = (rate: number) =>
````

## File: src/components/student/dashboard/StudentNav.tsx
````typescript
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { FileText } from "lucide-react";
````

## File: src/components/student/dashboard/subjects/SubjectGrades.tsx
````typescript
import Link from "next/link";
⋮----
interface SubjectGradesProps {
    grades: any[];
    gradeStats: {
        average: number;
        highest: number;
        lowest: number;
        total: number;
        completed: number;
    };
    classId: string;
}
⋮----
<span className="font-medium">Letter Grade:</span>
````

## File: src/components/student/dashboard/subjects/SubjectNavigation.tsx
````typescript
import Link from "next/link";
⋮----
interface SubjectNavigationProps {
    classId: string;
    currentTab: string;
}
````

## File: src/lib/alert-service.ts
````typescript
import prisma from "./prisma";
⋮----
export interface AlertData {
    id: string;
    message: string;
    viewed: boolean;
    createdAt: Date;
    type: 'OVERDUE_ASSIGNMENT' | 'GRADE_POSTED' | 'ATTENDANCE_ISSUE';
    studentId?: string;
    assignmentId?: string;
}
⋮----
export class AlertService
⋮----
static async generateOverdueAssignmentAlerts(): Promise<void>
⋮----
private static async createOverdueAssignmentAlert(
        parentId: string,
        studentId: string,
        assignment: any
): Promise<void>
⋮----
static async getParentAlerts(parentId: string): Promise<AlertData[]>
⋮----
static async markAlertAsViewed(alertId: string): Promise<void>
⋮----
static async markAllAlertsAsViewed(parentId: string): Promise<void>
⋮----
static async getUnreadAlertCount(parentId: string): Promise<number>
⋮----
private static determineAlertType(message: string): AlertData['type']
````

## File: src/lib/auth.ts
````typescript
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
⋮----
async authorize(credentials)
⋮----
async jwt(
async session(
````

## File: src/lib/idGenerator.ts
````typescript
import prisma from "@/lib/prisma";
⋮----
type IdType = "STUDENT" | "PARENT" | "TEACHER" | "APPLICANT";
⋮----
function formatId(prefix: string, year: number, number: number): string
⋮----
export async function generateHumanId(type: IdType): Promise<string>
````

## File: src/app/api/auth/[...nextauth]/route.ts
````typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
⋮----
async authorize(credentials: any)
⋮----
async jwt(
⋮----
async session(
````

## File: src/app/api/parent/alerts/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { AlertService } from "@/lib/alert-service";
⋮----
export async function GET(request: NextRequest)
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/api/teacher/route.ts
````typescript
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function GET()
````

## File: src/app/applicant/portal/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    User,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Calendar,
    Hash,
    GraduationCap
} from "lucide-react";
import Link from "next/link";
⋮----
const getTypeBadge = (type: string) =>
⋮----
return (
            <Badge variant={config.variant}>
                {config.label}
            </Badge>
        );
⋮----
````

## File: src/app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
⋮----
import { Analytics } from "@vercel/analytics/next"
⋮----
import AuthProvider from "@/components/providers/auth-provider";
⋮----
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
````

## File: src/app/login/page.tsx
````typescript
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/lib/validators";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    School,
    Mail,
    Lock,
    Eye,
    EyeOff,
    BookOpen,
    Users,
    GraduationCap,
    Sparkles,
    User
} from "lucide-react";
import { useState } from "react";
⋮----
function redirectToDashboard(role: string)
⋮----
const onSubmit = async (values: LoginInput) =>
⋮----
const togglePasswordVisibility = () =>
⋮----
<form onSubmit=
````

## File: src/app/student/dashboard/assignments/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { AssignmentList } from "@/components/student/dashboard/assignments/AssignmentList";
````

## File: src/app/teacher/classes/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
⋮----
export default async function TeacherClassesPage()
````

## File: src/components/AdminNav.tsx
````typescript
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
````

## File: src/lib/prisma.ts
````typescript
import { PrismaClient } from "@prisma/client";
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "next-auth.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

/src/generated/prisma
````

## File: src/app/admin/students/[id]/edit/page.tsx
````typescript
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
⋮----
interface Student {
    id: string;
    studentNumber: string;
    user: {
        id: string;
        firstName: string;
        middleName: string | null;
        lastName: string;
        email: string;
        gender: string;
        birthdate: string;
        address: string;
        phoneNumber: string | null;
    };
    section: {
        id: string;
        name: string;
        gradeLevel: number;
    };
    parent: {
        id: string;
        parentNumber: string;
    };
}
⋮----
interface Section {
    id: string;
    name: string;
    gradeLevel: number;
}
⋮----
interface Parent {
    id: string;
    parentNumber: string;
    user: {
        firstName: string;
        lastName: string;
    };
}
⋮----
const fetchData = async () =>
⋮----
// Unwrap the params Promise
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
⋮----
{/* Action Buttons */}
````

## File: src/app/api/admin/sections/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
export async function GET(request: NextRequest)
⋮----
export async function POST(request: NextRequest)
````

## File: src/app/globals.css
````css
@theme inline {
⋮----
:root {
⋮----
.dark {
⋮----
@layer base {
⋮----
* {
⋮----
body {
⋮----
.wmde-markdown {
⋮----
.wmde-markdown-var {
⋮----
.markdown-body {
⋮----
.markdown-body h1,
⋮----
.markdown-body p {
⋮----
.markdown-body ul,
⋮----
.markdown-body blockquote {
````

## File: src/app/parent/dashboard/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { StudentOverview } from "@/components/parent/dashboard/StudentOverview";
import { AlertSystem } from "@/components/parent/dashboard/AlertSystem";
import { AttendanceSummary } from "@/components/parent/dashboard/AttendanceSummary";
import { UpcomingDeadlines } from "@/components/parent/dashboard/UpcomingDeadlines";
import { RecentAnnouncements } from "@/components/parent/dashboard/RecentAnnouncements";
⋮----
interface DashboardData {
    students: Array<{
        id: string;
        studentNumber: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
        section: {
            gradeLevel: number;
            name: string;
        };
        attendance: Array<{
            date: Date;
            status: string;
        }>;
        grades: Array<{
            score: number;
            class: {
                subjectName: string;
            };
        }>;
    }>;
    assignments: Array<{
        id: string;
        title: string;
        description?: string | null;
        dueDate: Date;
        maxScore: number | null;
        status: string;
        class: {
            subjectName: string;
            teacher: {
                user: {
                    firstName: string;
                    lastName: string;
                };
            };
            section: {
                gradeLevel: number;
                name: string;
            };
        };
        submissions: Array<{
            studentId: string;
            status: string;
            submittedAt: Date | null;
        }>;
    }>;
    announcements: Array<{
        id: string;
        title: string;
        content: string;
        createdAt: Date;
        teacher: {
            user: {
                firstName: string;
                lastName: string;
            };
        };
        class: {
            subjectName: string;
            section: {
                gradeLevel: number;
                name: string;
            };
        } | null;
    }>;
    alerts: Array<{
        id: string;
        message: string;
        viewed: boolean;
        createdAt: Date;
    }>;
}
⋮----
export default async function ParentDashboardPage()
````

## File: src/app/signup/page.tsx
````typescript
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { School, Eye, EyeOff, GraduationCap } from "lucide-react";
⋮----
type SignupInput = z.infer<typeof SignupSchema>;
⋮----
const onSubmit = async (data: SignupInput) =>
⋮----
const togglePasswordVisibility = () =>
⋮----
const toggleConfirmPasswordVisibility = () =>
````

## File: src/app/admin/sections/[id]/edit/page.tsx
````typescript
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
⋮----
interface Teacher {
    id: string;
    employeeNumber: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    classes: Array<{
        id: string;
        subjectName: string;
        section: {
            name: string;
            gradeLevel: number;
        };
    }>;
}
⋮----
interface Class {
    id: string;
    subjectName: string;
    schedule: string | null;
    teacher: {
        id: string;
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
    };
}
⋮----
interface Section {
    id: string;
    gradeLevel: number;
    name: string;
    students: Array<{ id: string }>;
    classes: Class[];
}
⋮----
const fetchSection = async () =>
⋮----
const fetchTeachers = async () =>
⋮----
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
⋮----
const handleClassFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
⋮----
const handleSubmit = async (e: React.FormEvent) =>
⋮----
const handleAddClass = async (e: React.FormEvent) =>
⋮----
fetchSection(); // Refresh section data
⋮----
const handleUpdateClass = async (e: React.FormEvent) =>
⋮----
fetchSection(); // Refresh section data
⋮----
const handleDeleteClass = async (classId: string) =>
⋮----
const startEditClass = (classItem: Class) =>
⋮----
const cancelEdit = () =>
⋮----
const handleDelete = async () =>
````

## File: src/app/api/admin/sections/[id]/route.ts
````typescript
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
⋮----
interface RouteParams {
    params: {
        id: string;
    };
}
⋮----
export async function GET(request: Request,
⋮----
export async function POST(request: Request,
⋮----
export async function PUT(request: Request,
⋮----
export async function DELETE(request: Request,
````

## File: src/app/api/signup/route.ts
````typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateHumanId } from "@/lib/idGenerator";
import bcryptjs from 'bcryptjs';
⋮----
export async function POST(req: Request)
````

## File: src/app/page.tsx
````typescript
import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Target, Eye, BookOpen, Award } from "lucide-react";
⋮----
const StudentPortalSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" />
        <path d="M21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9C3 7.9 3.9 7 5 7H19C20.1 7 21 7.9 21 9Z" />
        <path d="M7 9V7C7 5.3 8.3 4 10 4H14C15.7 4 17 5.3 17 7V9" />
        <path d="M12 14V18" />
        <path d="M9 16H15" />
    </svg>
);
⋮----
const TeacherDashboardSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9L12 2L21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9Z" />
        <path d="M9 22V12H15V22" />
        <path d="M8 12H16" />
        <path d="M11 7H13" />
        <path d="M12 7V5" />
    </svg>
);
⋮----
const ParentMonitoringSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" />
        <path d="M12 12C14.2 12 16 10.2 16 8C16 5.8 14.2 4 12 4C9.8 4 8 5.8 8 8C8 10.2 9.8 12 12 12Z" />
        <path d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2" />
        <path d="M16 2C16 2 19 5 19 8C19 11 16 14 16 14" />
        <path d="M8 2C8 2 5 5 5 8C5 11 8 14 8 14" />
    </svg>
);
⋮----
const AdminToolsSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15Z" />
        <path d="M19.4 15C19.3 15.3 19.1 15.6 18.9 15.9L21 18C21.6 18.6 21.6 19.5 21 20.1C20.4 20.7 19.5 20.7 18.9 20.1L16.8 18C16.5 18.2 16.2 18.4 15.9 18.5C15.6 19.2 15 19.7 14.2 19.9L14 22H10L9.8 19.9C9 19.7 8.4 19.2 8.1 18.5C7.8 18.4 7.5 18.2 7.2 18L5.1 20.1C4.5 20.7 3.6 20.7 3 20.1C2.4 19.5 2.4 18.6 3 18L5.1 15.9C4.9 15.6 4.7 15.3 4.6 15C4.1 14.2 3.6 13.6 2.9 13.3L2 13V11L2.9 10.7C3.6 10.4 4.1 9.8 4.6 9C4.7 8.7 4.9 8.4 5.1 8.1L3 6C2.4 5.4 2.4 4.5 3 3.9C3.6 3.3 4.5 3.3 5.1 3.9L7.2 6C7.5 5.8 7.8 5.6 8.1 5.5C8.4 4.8 9 4.3 9.8 4.1L10 2H14L14.2 4.1C15 4.3 15.6 4.8 15.9 5.5C16.2 5.6 16.5 5.8 16.8 6L18.9 3.9C19.5 3.3 20.4 3.3 21 3.9C21.6 4.5 21.6 5.4 21 6L18.9 8.1C19.1 8.4 19.3 8.7 19.4 9C19.9 9.8 20.4 10.4 21.1 10.7L22 11V13L21.1 13.3C20.4 13.6 19.9 14.2 19.4 15Z" />
    </svg>
);
⋮----
const AssignmentSystemSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
        <path d="M14 2V8H20" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
    </svg>
);
⋮----
const AttendanceTrackingSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" />
        <path d="M12 6V12L16 14" />
        <path d="M7 12H12L15 15" />
        <path d="M9 16H15" />
    </svg>
);
⋮----
const GradeManagementSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
        <path d="M12 6V12L14 14" />
        <path d="M8 12H12L16 16" />
    </svg>
);
⋮----
const CommunicationHubSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15C21 15.5 20.6 16 20 16H13L9 20V16H4C3.4 16 3 15.5 3 15V4C3 3.5 3.4 3 4 3H20C20.6 3 21 3.5 21 4V15Z" />
        <path d="M7 9H17" />
        <path d="M7 12H13" />
        <path d="M7 7H17" />
    </svg>
);
````

## File: src/app/teacher/dashboard/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
⋮----
Due:
````

## File: src/app/student/dashboard/page.tsx
````typescript
import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { UpcomingTasks } from "@/components/student/dashboard/UpcomingTasks";
import { RecentActivity } from "@/components/student/dashboard/RecentActivity";
⋮----
interface DashboardData {
    upcomingTasks: Array<{
        id: string;
        title: string;
        type: 'ASSIGNMENT' | 'QUIZ';
        dueDate: Date;
        subject: string;
        subjectColor: string;
        status: 'PENDING' | 'SUBMITTED' | 'OVERDUE';
        priority: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    recentActivity: Array<{
        id: string;
        type: 'ANNOUNCEMENT' | 'MATERIAL' | 'GRADE' | 'SUBMISSION';
        title: string;
        description: string;
        subject: string;
        timestamp: Date;
        link: string;
    }>;
    stats: {
        totalPending: number;
        overdueCount: number;
        averageGrade: number;
        completedThisWeek: number;
    };
}
⋮----
export default async function StudentDashboardPage()
⋮----
async function getDashboardData(studentId: string): Promise<DashboardData>
⋮----
function getClassColor(subjectName: string): string
````

## File: prisma/schema.prisma
````
// LearnScape - Production Prisma Schema
// PostgreSQL + Prisma + Next.js + Supabase

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ------------------------------------
// ENUMS
// ------------------------------------

enum Role {
  APPLICANT
  STUDENT
  PARENT
  TEACHER
  ADMIN
}

enum Gender {
  MALE
  FEMALE
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

enum ApplicantType {
  NEW
  CONTINUING
  RETURNEE
  TRANSFEREE
}

enum MaterialType {
  VIDEO
  IMAGE
  DOCUMENT
  LINK
}

enum ApplicationStatus {
  PENDING // Application submitted, awaiting review
  UNDER_REVIEW // Currently being reviewed by admin
  APPROVED // Application accepted, student created
  REJECTED // Application denied
  WAITLISTED // Application on hold
}

enum AssignmentStatus {
  DRAFT
  PUBLISHED
  CLOSED
}

enum SubmissionStatus {
  NOT_SUBMITTED
  SUBMITTED
  LATE
  GRADED
}

enum QuizType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
}

enum QuizStatus {
  DRAFT
  PUBLISHED
  CLOSED
}

// ------------------------------------
// CORE USER MODEL
// ------------------------------------

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  firstName    String   @map("first_name")
  middleName   String?  @map("middle_name")
  lastName     String   @map("last_name")
  gender       Gender
  birthdate    DateTime
  address      String
  phoneNumber  String?  @map("phone_number")
  role         Role
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  applicant Applicant?
  parent    Parent?
  student   Student?
  teacher   Teacher?
  admin     Admin?

  messagesSent     Message[]          @relation("MessagesSent")
  messagesReceived Message[]          @relation("MessagesReceived")
  MaterialView     MaterialView[]
  AnnouncementView AnnouncementView[]
}

// ------------------------------------
// ROLE TABLES
// ------------------------------------

model Applicant {
  id              String            @id @default(cuid())
  userId          String            @unique @map("user_id")
  type            ApplicantType     @default(NEW) // 👈 New field
  status          ApplicationStatus @default(PENDING)
  applicantNumber String            @unique @map("applicant_number")
  referenceCode   String            @unique @map("reference_code")
  personalInfo    String?           @map("personal_info")
  createdAt       DateTime          @default(now()) @map("created_at")
  updatedAt       DateTime          @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id])
}

model IdCounter {
  id         String   @id @default(cuid())
  type       String // e.g. "STUDENT", "PARENT", "TEACHER"
  year       Int
  lastNumber Int      @default(0)
  updatedAt  DateTime @updatedAt

  @@unique([type, year]) // ensure only one counter per type per year
}

model Parent {
  id           String    @id @default(cuid())
  userId       String    @unique @map("user_id")
  user         User      @relation(fields: [userId], references: [id])
  parentNumber String    @unique @map("parent_number")
  students     Student[]
  alerts       Alert[]
}

model Section {
  id         String    @id @default(cuid())
  gradeLevel Int       @map("grade_level")
  name       String
  students   Student[]
  classes    Class[]
}

model Student {
  id            String @id @default(cuid())
  userId        String @unique @map("user_id")
  parentId      String @map("parent_id")
  sectionId     String @map("section_id")
  studentNumber String @unique @map("student_number")

  user    User    @relation(fields: [userId], references: [id])
  parent  Parent  @relation(fields: [parentId], references: [id])
  section Section @relation(fields: [sectionId], references: [id])

  attendance           Attendance[]
  grades               Grade[]
  AssignmentSubmission AssignmentSubmission[]
  QuizAttempt          QuizAttempt[]
}

model Teacher {
  id               String             @id @default(cuid())
  userId           String             @unique @map("user_id")
  user             User               @relation(fields: [userId], references: [id])
  employeeNumber   String             @unique @map("employee_number")
  joinedDate       DateTime           @default(now()) @map("joined_date")
  classes          Class[]
  attendance       Attendance[]
  grades           Grade[]
  LearningMaterial LearningMaterial[]
  Announcement     Announcement[]
  Assignment       Assignment[]
  Quiz             Quiz[]
}

model Admin {
  id     String @id @default(cuid())
  userId String @unique @map("user_id")
  user   User   @relation(fields: [userId], references: [id])
}

// ------------------------------------
// ACADEMIC STRUCTURE
// ------------------------------------

model Class {
  id          String  @id @default(cuid())
  subjectName String  @map("subject_name")
  sectionId   String  @map("section_id")
  teacherId   String  @map("teacher_id")
  schedule    String?

  section           Section            @relation(fields: [sectionId], references: [id])
  teacher           Teacher            @relation(fields: [teacherId], references: [id])
  attendance        Attendance[]
  grades            Grade[]
  learningMaterials LearningMaterial[] @relation("ClassMaterials") // Fixed this line
  announcements     Announcement[]     @relation("ClassAnnouncements") // Fixed this line
  Assignment        Assignment[]
  Quiz              Quiz[]
}

// ------------------------------------
// ATTENDANCE
// ------------------------------------

model Attendance {
  id        String           @id @default(cuid())
  studentId String           @map("student_id")
  classId   String           @map("class_id")
  teacherId String           @map("teacher_id")
  date      DateTime
  status    AttendanceStatus
  remarks   String?
  createdAt DateTime         @default(now()) @map("created_at")

  student Student @relation(fields: [studentId], references: [id])
  class   Class   @relation(fields: [classId], references: [id])
  teacher Teacher @relation(fields: [teacherId], references: [id])
}

// ------------------------------------
// GRADES
// ------------------------------------

model Grade {
  id           String   @id @default(cuid())
  studentId    String   @map("student_id")
  classId      String   @map("class_id")
  teacherId    String   @map("teacher_id")
  assignmentId String?  @map("assignment_id") // Add this line
  score        Float
  remarks      String?
  gradedAt     DateTime @default(now()) @map("graded_at")

  student    Student     @relation(fields: [studentId], references: [id])
  class      Class       @relation(fields: [classId], references: [id])
  teacher    Teacher     @relation(fields: [teacherId], references: [id])
  assignment Assignment? @relation(fields: [assignmentId], references: [id])
}

// ------------------------------------
// ALERTS & MESSAGES
// ------------------------------------

model Alert {
  id        String   @id @default(cuid())
  parentId  String   @map("parent_id")
  message   String
  createdAt DateTime @default(now()) @map("created_at")
  viewed    Boolean  @default(false)

  parent Parent @relation(fields: [parentId], references: [id])
}

model Message {
  id         String   @id @default(cuid())
  senderId   String   @map("sender_id")
  receiverId String   @map("receiver_id")
  content    String
  sentAt     DateTime @default(now()) @map("sent_at")

  sender   User @relation("MessagesSent", fields: [senderId], references: [id])
  receiver User @relation("MessagesReceived", fields: [receiverId], references: [id])
}

// for learning materials and announcements
model LearningMaterial {
  id          String       @id @default(cuid())
  title       String
  description String?
  type        MaterialType
  url         String
  teacherId   String       @map("teacher_id")
  classId     String?      @map("class_id")
  createdAt   DateTime     @default(now()) @map("created_at")

  teacher Teacher        @relation(fields: [teacherId], references: [id])
  class   Class?         @relation("ClassMaterials", fields: [classId], references: [id]) // Add relation name
  views   MaterialView[]
}

model Assignment {
  id          String           @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime         @map("due_date")
  maxScore    Int?             @map("max_score")
  status      AssignmentStatus @default(PUBLISHED)
  classId     String           @map("class_id")
  teacherId   String           @map("teacher_id")
  createdAt   DateTime         @default(now()) @map("created_at")
  updatedAt   DateTime         @updatedAt @map("updated_at")

  class       Class                  @relation(fields: [classId], references: [id])
  teacher     Teacher                @relation(fields: [teacherId], references: [id])
  submissions AssignmentSubmission[]
  grades      Grade[]

  @@map("assignments")
}

model Quiz {
  id          String     @id @default(cuid())
  title       String
  description String?
  type        QuizType   @default(MULTIPLE_CHOICE)
  status      QuizStatus @default(DRAFT)
  timeLimit   Int?       @map("time_limit") // in minutes
  maxAttempts Int        @default(1) @map("max_attempts")
  dueDate     DateTime   @map("due_date")
  maxScore    Int        @default(100) @map("max_score")
  classId     String     @map("class_id")
  teacherId   String     @map("teacher_id")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  class     Class          @relation(fields: [classId], references: [id])
  teacher   Teacher        @relation(fields: [teacherId], references: [id])
  questions QuizQuestion[]
  attempts  QuizAttempt[]

  @@map("quizzes")
}

model QuizQuestion {
  id           String   @id @default(cuid())
  quizId       String   @map("quiz_id")
  order        Int // Order of the question in the quiz
  questionText String   @map("question_text")
  type         QuizType @default(MULTIPLE_CHOICE)
  points       Int      @default(1)
  options      Json // Array of { id: string, text: string, isCorrect: boolean }

  quiz       Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  QuizAnswer QuizAnswer[]

  @@map("quiz_questions")
}

model QuizAttempt {
  id          String    @id @default(cuid())
  quizId      String    @map("quiz_id")
  studentId   String    @map("student_id")
  score       Int?
  startedAt   DateTime  @default(now()) @map("started_at")
  submittedAt DateTime? @map("submitted_at")
  timeSpent   Int?      @map("time_spent") // in seconds

  quiz    Quiz         @relation(fields: [quizId], references: [id])
  student Student      @relation(fields: [studentId], references: [id])
  answers QuizAnswer[]

  @@unique([quizId, studentId]) // One attempt per student per quiz (unless maxAttempts > 1)
  @@map("quiz_attempts")
}

model QuizAnswer {
  id             String   @id @default(cuid())
  attemptId      String   @map("attempt_id")
  questionId     String   @map("question_id")
  selectedOption String?  @map("selected_option") // ID of selected option
  answerText     String?  @map("answer_text") // For short answer questions
  isCorrect      Boolean? @map("is_correct")
  points         Int? // Points earned for this question

  attempt  QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question QuizQuestion @relation(fields: [questionId], references: [id])

  @@unique([attemptId, questionId])
  @@map("quiz_answers")
}

model AssignmentSubmission {
  id           String           @id @default(cuid())
  assignmentId String           @map("assignment_id")
  studentId    String           @map("student_id")
  fileUrl      String?          @map("file_url")
  submittedAt  DateTime?        @map("submitted_at")
  status       SubmissionStatus @default(NOT_SUBMITTED)
  score        Int?
  feedback     String?
  createdAt    DateTime         @default(now()) @map("created_at")
  updatedAt    DateTime         @updatedAt @map("updated_at")

  assignment Assignment @relation(fields: [assignmentId], references: [id])
  student    Student    @relation(fields: [studentId], references: [id])

  @@unique([assignmentId, studentId])
  @@map("assignment_submissions")
}

model MaterialView {
  id         String   @id @default(cuid())
  materialId String   @map("material_id")
  userId     String   @map("user_id")
  viewedAt   DateTime @default(now()) @map("viewed_at")

  material LearningMaterial @relation(fields: [materialId], references: [id])
  user     User             @relation(fields: [userId], references: [id])

  @@unique([materialId, userId])
}

model Announcement {
  id        String   @id @default(cuid())
  title     String
  content   String
  teacherId String   @map("teacher_id")
  classId   String?  @map("class_id")
  createdAt DateTime @default(now()) @map("created_at")

  teacher Teacher            @relation(fields: [teacherId], references: [id])
  class   Class?             @relation("ClassAnnouncements", fields: [classId], references: [id]) // Add relation name
  views   AnnouncementView[]
}

model AnnouncementView {
  id             String   @id @default(cuid())
  announcementId String   @map("announcement_id")
  userId         String   @map("user_id")
  viewedAt       DateTime @default(now()) @map("viewed_at")

  announcement Announcement @relation(fields: [announcementId], references: [id])
  user         User         @relation(fields: [userId], references: [id])

  @@unique([announcementId, userId])
}
````

## File: package.json
````json
{
  "name": "school-management-system",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@next-auth/prisma-adapter": "^1.0.7",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-slot": "^1.2.3",
    "@react-email/render": "^1.4.0",
    "@uiw/react-md-editor": "^4.0.8",
    "@vercel/analytics": "^1.5.0",
    "@vercel/blob": "^2.0.0",
    "@vercel/speed-insights": "^1.2.0",
    "bcrypt": "^6.0.0",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.545.0",
    "next": "15.5.4",
    "next-auth": "^4.24.11",
    "next-themes": "^0.4.6",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.65.0",
    "resend": "^6.2.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.3.1",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@prisma/client": "^6.17.1",
    "@tailwindcss/postcss": "^4",
    "@types/bcrypt": "^6.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.5.4",
    "prisma": "^6.17.1",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
````
