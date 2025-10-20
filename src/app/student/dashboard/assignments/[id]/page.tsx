import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssignmentHeader } from "@/components/student/dashboard/assignments/AssignmentHeader";
import { SubmissionStatus } from "@/components/student/dashboard/assignments/SubmissionStatus";
import { SubmitWorkForm } from "@/components/student/dashboard/assignments/SubmitWorkForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AssignmentDetailPage({ params }: PageProps) {
  const session = await requireSession(["STUDENT", "ADMIN"]);

  const student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: {
      section: true,
    },
  });

  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800">Student Record Not Found</h2>
          <p className="text-red-600">We couldn't find your student information.</p>
        </div>
      </div>
    );
  }

  // Get the assignment with all related data
  const assignment = await prisma.assignment.findFirst({
    where: {
      id: params.id,
      class: {
        sectionId: student.sectionId,
      },
      status: "PUBLISHED",
    },
    include: {
      class: {
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      submissions: {
        where: {
          studentId: student.id,
        },
      },
      teacher: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  const submission = assignment.submissions[0];
  const now = new Date();
  const isPastDue = assignment.dueDate < now;
  const canSubmit = !submission || (submission.status === 'NOT_SUBMITTED' && !isPastDue);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/student/assignments"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Homework
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AssignmentHeader
            assignment={assignment}
            isPastDue={isPastDue}
          />

          <SubmissionStatus
            assignment={assignment}
            submission={submission}
            studentId={student.id}
          />

          {canSubmit && (
            <SubmitWorkForm
              assignment={assignment}
              studentId={student.id}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Teacher Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Teacher</h3>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                <span className="text-blue-600 font-semibold">
                  {assignment.teacher.user.firstName[0]}{assignment.teacher.user.lastName[0]}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {assignment.teacher.user.firstName} {assignment.teacher.user.lastName}
                </p>
                <p className="text-sm text-gray-600">{assignment.class.subjectName}</p>
              </div>
            </div>
          </div>

          {/* Due Date Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Due Date</h3>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isPastDue ? 'text-red-600' : 'text-green-600'
                }`}>
                {assignment.dueDate.toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {assignment.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {isPastDue ? (
                <div className="text-red-600 text-sm mt-2">Past due date</div>
              ) : (
                <div className="text-green-600 text-sm mt-2">Still open for submission</div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/student/classes/${assignment.classId}`}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Class
              </Link>
              <Link
                href="/student/dashboard"
                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}