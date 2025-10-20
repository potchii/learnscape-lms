import { requireSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileUploadModal } from "./FileUploadModal";
import { AssignmentDetailsModal } from "./AssignmentDetailsModal";

interface AssignmentWithSubmission {
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

export default async function StudentAssignmentsPage() {
  const session = await requireSession(["STUDENT", "ADMIN"]);

  // First get the student with their section
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

  // Then get assignments for the student's classes
  const assignments = await prisma.assignment.findMany({
    where: {
      status: "PUBLISHED",
      class: {
        sectionId: student.sectionId,
      },
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
    },
    orderBy: {
      dueDate: 'asc',
    },
  });

  // Separate upcoming and past assignments
  const now = new Date();
  const upcomingAssignments = assignments.filter(a => a.dueDate > now);
  const pastAssignments = assignments.filter(a => a.dueDate <= now);

  const getStatusColor = (assignment: AssignmentWithSubmission) => {
    const submission = assignment.submissions[0];

    if (!submission || submission.status === 'NOT_SUBMITTED') {
      return assignment.dueDate < now ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
    }

    if (submission.status === 'SUBMITTED') return 'bg-blue-100 text-blue-800';
    if (submission.status === 'LATE') return 'bg-orange-100 text-orange-800';
    if (submission.status === 'GRADED') return 'bg-green-100 text-green-800';

    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (assignment: AssignmentWithSubmission) => {
    const submission = assignment.submissions[0];

    if (!submission || submission.status === 'NOT_SUBMITTED') {
      return assignment.dueDate < now ? 'Missed' : 'Not Submitted';
    }

    return submission.status.charAt(0) + submission.status.slice(1).toLowerCase();
  };

  const canSubmit = (assignment: AssignmentWithSubmission) => {
    const submission = assignment.submissions[0];
    const isPastDue = assignment.dueDate < new Date();

    // Can submit if: not submitted yet OR submitted but assignment still open
    return (!submission || submission.status === 'NOT_SUBMITTED') && !isPastDue;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Link
            href="/student/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600">
          Track and manage your assignments
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
          <div className="text-sm text-gray-600">Total Assignments</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-orange-600">{upcomingAssignments.length}</div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {pastAssignments.filter(a => a.submissions[0]?.status === 'GRADED').length}
          </div>
          <div className="text-sm text-gray-600">Graded</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-red-600">
            {assignments.filter(a => !a.submissions[0] || a.submissions[0].status === 'NOT_SUBMITTED').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Assignments</h2>
            <p className="text-sm text-gray-600 mt-1">Assignments due soon - submit your work</p>
          </div>

          <div className="p-6">
            {upcomingAssignments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment)}`}>
                            {getStatusText(assignment)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 line-clamp-2">{assignment.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Due {assignment.dueDate.toLocaleDateString()}
                          </span>
                          <span>{assignment.class.subjectName}</span>
                          <span>{assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}</span>
                          {assignment.maxScore && (
                            <span>Max Score: {assignment.maxScore}</span>
                          )}
                        </div>

                        {/* Show submission info if already submitted */}
                        {assignment.submissions[0]?.submittedAt && (
                          <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-blue-700 flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Submitted on {assignment.submissions[0].submittedAt.toLocaleDateString()}
                              {assignment.submissions[0].fileUrl && (
                                <a
                                  href={assignment.submissions[0].fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                >
                                  View File
                                </a>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {canSubmit(assignment) && (
                          <FileUploadModal assignment={assignment} />
                        )}
                        <AssignmentDetailsModal assignment={assignment} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No upcoming assignments. Enjoy your free time!</p>
              </div>
            )}
          </div>
        </div>

        {/* Past Assignments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Past Assignments</h2>
            <p className="text-sm text-gray-600 mt-1">Completed and graded work</p>
          </div>

          <div className="p-6">
            {pastAssignments.length > 0 ? (
              <div className="space-y-4">
                {pastAssignments.map((assignment) => {
                  const submission = assignment.submissions[0];
                  return (
                    <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment)}`}>
                              {getStatusText(assignment)}
                            </span>
                            {submission?.score && assignment.maxScore && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                {submission.score}/{assignment.maxScore}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2 line-clamp-2">{assignment.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Due {assignment.dueDate.toLocaleDateString()}</span>
                            <span>{assignment.class.subjectName}</span>
                            <span>{assignment.class.teacher.user.firstName} {assignment.class.teacher.user.lastName}</span>
                            {submission?.submittedAt && (
                              <span>Submitted {submission.submittedAt.toLocaleDateString()}</span>
                            )}
                            {submission?.fileUrl && (
                              <a
                                href={submission.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Download File
                              </a>
                            )}
                          </div>
                          {submission?.feedback && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <p className="text-sm text-gray-700">
                                <strong>Feedback:</strong> {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <AssignmentDetailsModal assignment={assignment} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No past assignments to show.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}