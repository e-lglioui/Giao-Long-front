import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { PrivateRoute } from "./components/PrivateRoute"
import DashboardLayout from "@/features/dashboard/DashboardLayout"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { RegisterForm } from "@/features/auth/components/RegisterForm"
import { EventsListPage } from "@/features/events/pages/EventsListPage"
import { CreateEventPage } from "@/features/events/pages/CreateEventPage"
import { EventDetailPage } from "@/features/events/pages/EventDetailPage"
import { UpdateEventPage } from "@/features/events/pages/UpdateEventPage"
import { UpdateParticipantPage } from "@/features/events/pages/UpdateParticipantPage"
import { ParticipantSearchPage } from "@/features/events/pages/ParticipantSearchPage"
import { RegisterParticipantPage } from "@/features/events/pages/RegisterParticipantPage"
import { MyEventsPage } from "@/features/events/pages/MyEventsPage"
import { DashboardHome } from "@/features/dashboard/pages/DashboardHome"
import { CheckEmail } from "@/features/auth/components/CheckEmail"
import { ForgotPassword } from "@/features/auth/components/ForgotPassword"
import { ResetPassword } from "@/features/auth/components/ResetPassword"
import { ConfirmEmail } from "@/features/auth/components/ConfirmEmail"
import { ManageMembersForm } from "@/features/schools/components/ManageMembersForm"
import { SchoolsList } from "@/features/schools/components/SchoolsList"
import { CreateSchoolForm } from "@/features/schools/components/CreateSchoolForm"
import { SchoolAdminCreateForm } from "@/features/schools/components/SchoolAdminCreateForm"
import { SchoolAdminEditForm } from "@/features/schools/components/SchoolAdminEditForm"
import { SchoolDetailPage } from "@/features/schools/pages/SchoolDetailPage"
import { SchoolAdminMySchoolPage } from "@/features/schools/pages/SchoolAdminMySchoolPage"
import { SchoolMapPage } from "@/features/schools/pages/school-map-page"
import ProfilePage from "@/features/profile/components/ProfilePage"
import { StudentsListPage } from "@/features/students/pages/StudentsListPage"
import { StudentDetailPage } from "@/features/students/pages/StudentDetailPage"
import { CreateStudentPage } from "@/features/students/pages/CreateStudentPage"
// Course imports
import { CourseListPage } from "@/features/courses/pages/CourseListPage"
import { CreateCoursePage } from "@/features/courses/pages/CreateCoursePage"
import { CourseDetailPage } from "@/features/courses/pages/CourseDetailPage"
import { UpdateCoursePage } from "@/features/courses/pages/UpdateCoursePage"
// Instructor imports
import { InstructorsListPage } from "@/features/instructors/pages/instructors-list-page"
import { InstructorDetailPage } from "@/features/instructors/pages/instructor-detail-page"
import { CreateInstructorPage } from "@/features/instructors/pages/create-instructor-page"
import { EditInstructorPage } from "@/features/instructors/pages/edit-instructor-page"
import { InstructorFullProfilePage } from "@/features/instructors/pages/instructor-full-profile-page"
import { SchoolAdminImageUpload } from "@/features/schools/components/SchoolAdminImageUpload"
// New pages
import StaffManagement from "@/features/schools/pages/staff-management "

import PaymentManagement from "@/features/schools/pages/payment-management"
import {Homepage} from "@/pages/Homepage"
import SchoolDetail from"@/pages/SchoolDetail"
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Homepage/>} />
        <Route path="/detail/:id" element={<SchoolDetail />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* Auth Flow Routes */}
        <Route path="/auth">
          <Route path="check-email" element={<CheckEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="confirm-email" element={<ConfirmEmail />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="statistiques" replace />} />
          <Route path="statistiques" element={<DashboardHome />} />
          <Route path="my-events" element={<MyEventsPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Event Routes */}
          <Route path="events" element={<EventsListPage />} />
          <Route path="events/create" element={<CreateEventPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="events/edit/:id" element={<UpdateEventPage />} />
          <Route path="events/:eventId/participants/edit/:participantId" element={<UpdateParticipantPage />} />
          <Route path="events/:eventId/participants/search" element={<ParticipantSearchPage />} />
          <Route path="events/:eventId/participants/new" element={<RegisterParticipantPage />} />

          {/* School Routes */}
          <Route path="schools">
            <Route index element={<SchoolsList />} />
            <Route path="create" element={<CreateSchoolForm />} />
            <Route path="map" element={<SchoolMapPage />} />
            <Route path=":id" element={<SchoolDetailPage />} />
            <Route path=":id/edit" element={<CreateSchoolForm />} />
            <Route path="my-school" element={<SchoolAdminMySchoolPage />} />
            <Route path="my-school/edit" element={<SchoolAdminEditForm />} />
            <Route path="my-school/create" element={<SchoolAdminCreateForm />} />
            <Route path="my-school/images/upload-multiple" element={<SchoolAdminImageUpload />} />
            <Route path=":schoolId/instructors">
              <Route path=":instructorId/edit" element={<ManageMembersForm />} />
            </Route>
            <Route path=":schoolId/students">
              <Route path="add" element={<ManageMembersForm />} />
              <Route path=":studentId/edit" element={<ManageMembersForm />} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route path="students">
            <Route index element={<StudentsListPage />} />
            <Route path=":id" element={<StudentDetailPage />} />
            <Route path="create" element={<CreateStudentPage />} />
          </Route>

          {/* Instructor Routes */}
          <Route path="instructors">
            <Route index element={<InstructorsListPage />} />
            <Route path=":id" element={<InstructorDetailPage />} />
            <Route path=":id/full-profile" element={<InstructorFullProfilePage />} />
            <Route path="create" element={<CreateInstructorPage />} />
            <Route path=":id/edit" element={<EditInstructorPage />} />
          </Route>

          {/* Course Routes */}
          <Route path="courses">
            <Route index element={<CourseListPage />} />
            <Route path="create" element={<CreateCoursePage />} />
            <Route path=":id" element={<CourseDetailPage />} />
            <Route path=":id/edit" element={<UpdateCoursePage />} />
          </Route>

          {/* New Routes */}
          <Route path="staff" element={<StaffManagement />} />
      
          <Route path="payments" element={<PaymentManagement />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App

