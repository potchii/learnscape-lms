// Complete updated src/app/page.tsx with SVGs
import React from 'react'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users, Target, Eye, BookOpen, Award } from "lucide-react";

// SVG Components
const StudentPortalSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" />
        <path d="M21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9C3 7.9 3.9 7 5 7H19C20.1 7 21 7.9 21 9Z" />
        <path d="M7 9V7C7 5.3 8.3 4 10 4H14C15.7 4 17 5.3 17 7V9" />
        <path d="M12 14V18" />
        <path d="M9 16H15" />
    </svg>
);

const TeacherDashboardSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9L12 2L21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9Z" />
        <path d="M9 22V12H15V22" />
        <path d="M8 12H16" />
        <path d="M11 7H13" />
        <path d="M12 7V5" />
    </svg>
);

const ParentMonitoringSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" />
        <path d="M12 12C14.2 12 16 10.2 16 8C16 5.8 14.2 4 12 4C9.8 4 8 5.8 8 8C8 10.2 9.8 12 12 12Z" />
        <path d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2" />
        <path d="M16 2C16 2 19 5 19 8C19 11 16 14 16 14" />
        <path d="M8 2C8 2 5 5 5 8C5 11 8 14 8 14" />
    </svg>
);

const AdminToolsSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15C13.7 15 15 13.7 15 12C15 10.3 13.7 9 12 9C10.3 9 9 10.3 9 12C9 13.7 10.3 15 12 15Z" />
        <path d="M19.4 15C19.3 15.3 19.1 15.6 18.9 15.9L21 18C21.6 18.6 21.6 19.5 21 20.1C20.4 20.7 19.5 20.7 18.9 20.1L16.8 18C16.5 18.2 16.2 18.4 15.9 18.5C15.6 19.2 15 19.7 14.2 19.9L14 22H10L9.8 19.9C9 19.7 8.4 19.2 8.1 18.5C7.8 18.4 7.5 18.2 7.2 18L5.1 20.1C4.5 20.7 3.6 20.7 3 20.1C2.4 19.5 2.4 18.6 3 18L5.1 15.9C4.9 15.6 4.7 15.3 4.6 15C4.1 14.2 3.6 13.6 2.9 13.3L2 13V11L2.9 10.7C3.6 10.4 4.1 9.8 4.6 9C4.7 8.7 4.9 8.4 5.1 8.1L3 6C2.4 5.4 2.4 4.5 3 3.9C3.6 3.3 4.5 3.3 5.1 3.9L7.2 6C7.5 5.8 7.8 5.6 8.1 5.5C8.4 4.8 9 4.3 9.8 4.1L10 2H14L14.2 4.1C15 4.3 15.6 4.8 15.9 5.5C16.2 5.6 16.5 5.8 16.8 6L18.9 3.9C19.5 3.3 20.4 3.3 21 3.9C21.6 4.5 21.6 5.4 21 6L18.9 8.1C19.1 8.4 19.3 8.7 19.4 9C19.9 9.8 20.4 10.4 21.1 10.7L22 11V13L21.1 13.3C20.4 13.6 19.9 14.2 19.4 15Z" />
    </svg>
);

const AssignmentSystemSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
        <path d="M14 2V8H20" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
    </svg>
);

const AttendanceTrackingSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" />
        <path d="M12 6V12L16 14" />
        <path d="M7 12H12L15 15" />
        <path d="M9 16H15" />
    </svg>
);

const GradeManagementSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
        <path d="M12 6V12L14 14" />
        <path d="M8 12H12L16 16" />
    </svg>
);

const CommunicationHubSVG = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15C21 15.5 20.6 16 20 16H13L9 20V16H4C3.4 16 3 15.5 3 15V4C3 3.5 3.4 3 4 3H20C20.6 3 21 3.5 21 4V15Z" />
        <path d="M7 9H17" />
        <path d="M7 12H13" />
        <path d="M7 7H17" />
    </svg>
);

const page = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <School className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">LearnScape LMS</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-blue-600">LearnScape</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        A comprehensive Learning Management System designed specifically for Brightfield Primary School,
                        empowering students, teachers, and parents in the digital learning journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/login">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="#about">
                            <Button size="lg" variant="outline">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">About LearnScape</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            LearnScape is a modern, intuitive Learning Management System built with Next.js,
                            designed to streamline educational processes and enhance the learning experience
                            for the Brightfield Primary School community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle>For Everyone</CardTitle>
                                <CardDescription>
                                    Serving students, teachers, parents, and administrators with tailored experiences
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Our platform provides customized dashboards and tools for each user role,
                                    ensuring everyone has what they need to succeed.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <BookOpen className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle>Comprehensive Features</CardTitle>
                                <CardDescription>
                                    Assignment management, grading, attendance tracking, and more
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    From assignment submissions to grade management and parent alerts,
                                    LearnScape covers all aspects of modern education management.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <Award className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle>Modern Technology</CardTitle>
                                <CardDescription>
                                    Built with cutting-edge web technologies for optimal performance
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Utilizing Next.js, TypeScript, Prisma, and modern UI components to deliver
                                    a fast, reliable, and user-friendly experience.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Mission */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                        <Target className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    To provide a comprehensive digital learning environment that empowers educators,
                                    engages students, and connects parents in the educational journey. We strive to
                                    create an intuitive platform that simplifies administrative tasks while enhancing
                                    the learning experience through innovative technology.
                                </p>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        Empower teachers with efficient classroom management tools
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        Engage students with interactive learning materials
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        Connect parents to their children's educational progress
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                        Streamline administrative processes for school staff
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Vision */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                        <Eye className="h-5 w-5 text-green-600" />
                                    </div>
                                    <CardTitle className="text-2xl">Our Vision</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 leading-relaxed">
                                    To become the leading educational platform that transforms traditional learning
                                    environments into dynamic, connected communities where every student can thrive.
                                    We envision a future where technology seamlessly bridges the gap between classroom
                                    instruction and home learning.
                                </p>
                                <ul className="mt-4 space-y-2 text-gray-600">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Foster a collaborative learning ecosystem
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Personalize education through data-driven insights
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Bridge the gap between school and home learning
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        Prepare students for success in a digital world
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Overview with SVGs */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
                        <p className="text-lg text-gray-600">
                            Discover the powerful tools that make LearnScape the ideal choice for modern education
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Student Portal",
                                desc: "Access assignments, grades, and learning materials",
                                svg: <StudentPortalSVG />
                            },
                            {
                                title: "Teacher Dashboard",
                                desc: "Manage classes, create assignments, and track progress",
                                svg: <TeacherDashboardSVG />
                            },
                            {
                                title: "Parent Monitoring",
                                desc: "Stay informed about your child's academic journey",
                                svg: <ParentMonitoringSVG />
                            },
                            {
                                title: "Admin Tools",
                                desc: "Comprehensive school management and analytics",
                                svg: <AdminToolsSVG />
                            },
                            {
                                title: "Assignment System",
                                desc: "Create, submit, and grade assignments digitally",
                                svg: <AssignmentSystemSVG />
                            },
                            {
                                title: "Attendance Tracking",
                                desc: "Monitor student presence and participation",
                                svg: <AttendanceTrackingSVG />
                            },
                            {
                                title: "Grade Management",
                                desc: "Track and analyze student performance",
                                svg: <GradeManagementSVG />
                            },
                            {
                                title: "Communication Hub",
                                desc: "Announcements and alerts for the school community",
                                svg: <CommunicationHubSVG />
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 group">
                                <CardContent className="pt-6">
                                    <div className="w-16 h-16 mx-auto mb-4 text-blue-600 group-hover:text-blue-700 transition-colors">
                                        {feature.svg}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Transform Learning?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join the LearnScape community and experience the future of education management today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                                Create Account
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="text-blue-600 hover:bg-blue-50">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <School className="h-6 w-6 text-blue-400" />
                                <span className="ml-2 text-lg font-bold">LearnScape LMS</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Empowering education through innovative technology for Brightfield Primary School.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Platform</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Student Portal</li>
                                <li>Teacher Dashboard</li>
                                <li>Parent Access</li>
                                <li>Admin Panel</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Brightfield Primary School</li>
                                <li>123 Example Street</li>
                                <li>info@brightfield.edu</li>
                                <li>(046) 484-1234</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} LearnScape LMS. Developed by Nez.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default page