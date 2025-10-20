import { Assignment, AssignmentSubmission } from "@prisma/client";
import Link from "next/link";

interface AssignmentWithClass extends Assignment {
  class: {
    subjectName: string;
  };
}

interface SubmissionStatusProps {
  assignment: AssignmentWithClass;
  submission: AssignmentSubmission | undefined;
  studentId: string;
}

export function SubmissionStatus({ assignment, submission, studentId }: SubmissionStatusProps) {
  const getStatusInfo = () => {
    if (!submission || submission.status === 'NOT_SUBMITTED') {
      const isPastDue = new Date() > assignment.dueDate;
      return {
        icon: isPastDue ? '❌' : '📝',
        title: isPastDue ? 'Not Submitted - Past Due' : 'Not Submitted Yet',
        description: isPastDue
          ? 'The due date has passed for this assignment.'
          : 'You haven\'t submitted this assignment yet.',
        color: isPastDue ? 'red' : 'yellow',
        showSubmit: !isPastDue,
      };
    }

    switch (submission.status) {
      case 'SUBMITTED':
        return {
          icon: '📤',
          title: 'Submitted',
          description: 'Your work has been submitted and is awaiting grading.',
          color: 'blue',
          showSubmit: false,
        };
      case 'LATE':
        return {
          icon: '⏰',
          title: 'Submitted Late',
          description: 'Your work was submitted after the due date.',
          color: 'orange',
          showSubmit: false,
        };
      case 'GRADED':
        return {
          icon: '✅',
          title: 'Graded',
          description: `Your work has been graded. Score: ${submission.score}/${assignment.maxScore}`,
          color: 'green',
          showSubmit: false,
        };
      default:
        return {
          icon: '❓',
          title: 'Unknown Status',
          description: 'Unable to determine submission status.',
          color: 'gray',
          showSubmit: false,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800',
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Submission</h2>

        <div className={`border rounded-lg p-4 ${colorClasses[statusInfo.color as keyof typeof colorClasses]}`}>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{statusInfo.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold">{statusInfo.title}</h3>
              <p className="text-sm mt-1">{statusInfo.description}</p>

              {submission?.submittedAt && (
                <p className="text-sm mt-2">
                  Submitted on: {submission.submittedAt.toLocaleDateString()} at{' '}
                  {submission.submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}

              {submission?.fileUrl && (
                <div className="mt-3">
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                  >
                    📎 View Submitted File
                  </a>
                </div>
              )}

              {submission?.feedback && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <h4 className="font-semibold text-sm mb-1">Teacher Feedback:</h4>
                  <p className="text-sm">{submission.feedback}</p>
                </div>
              )}
            </div>
          </div>

          {statusInfo.showSubmit && (
            <div className="mt-4 flex space-x-2">
              <Link
                href={`/student/dashboard/assignments/${assignment.id}/submit`}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Your Work
              </Link>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                Ask for Help
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}