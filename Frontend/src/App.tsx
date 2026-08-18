import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ================================
// Layouts
// ================================

import AdminLayout from "./components/AdminLayout";
import PublicLayout from "./components/PublicLayout";

// ================================
// Pages
// ================================

import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";

import Admin from "./pages/Admin";
import AddCertificate from "./pages/AddCertificate";
import AdminStudents from "./pages/AdminStudents";
import AdminStudentDetails from "./pages/AdminStudentDetails";
import AdminDashboard from "./pages/AdminDashboard";

// ================================
// Blog
// ================================

import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Index from "./pages/Index";

// Existing Admin Blog
import AdminBlog from "./pages/Admin";

// ================================
// Student Corner
// ================================

import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Competition from "./pages/Competition";
import Lathi from "./pages/Lathi";
import Nunchaku from "./pages/Nunchaku";
import HelpDesk from "./pages/HelpDesk";
import CompetitionDetails from "./pages/CompetitionDetails";
import Courses from "./pages/Courses";

// ================================
// Results
// ================================

import ResultSessions from "./pages/ResultSessionS";
import ResultSearch from "./pages/ResultSearch";
import ResultView from "./pages/ResultView";

// ================================
// Attendance
// ================================

import AdminAttendance from "./pages/Attendance/AdminAttendance";
import AttendanceReport from "./pages/Attendance/AttendanceReport";
import AdminFees from "./pages/Fees/AdminFees";
import StudentFeeHistory from "./pages/Fees/StudentFeeHistory";
import FeeReports from "./pages/Fees/FeeReports";
import AdminInventory from "./pages/Inventory/AdminInventory";


// ================================
// Query Client
// ================================

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      <Toaster />
      <Sonner />

      <BrowserRouter>

        <Routes>

          {/* =====================================================
              PUBLIC WEBSITE
              Navbar comes from PublicLayout
          ===================================================== */}

          <Route element={<PublicLayout />}>

            {/* Main Landing Page */}

            <Route
              path="/"
              element={<Index />}
            />

            {/* Auth */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />

            <Route
              path="/register"
              element={<Signup />}
            />

            {/* Student Dashboard */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/add"
              element={<AddCertificate />}
            />

            {/* Blog */}

            <Route
              path="/blog"
              element={<Blog />}
            />

            <Route
              path="/blog/:id"
              element={<BlogDetail />}
            />

            {/* Student Corner */}

            <Route
              path="/students"
              element={<Students />}
            />

            <Route
              path="/students/:id"
              element={<StudentDetails />}
            />

            <Route
              path="/competition"
              element={<Competition />}
            />

            <Route
              path="/competition/:id"
              element={<CompetitionDetails />}
            />

            <Route
              path="/lathi"
              element={<Lathi />}
            />

            <Route
              path="/nunchaku"
              element={<Nunchaku />}
            />

            <Route
              path="/help"
              element={<HelpDesk />}
            />

            <Route
              path="/courses"
              element={<Courses />}
            />

            {/* Results */}

            <Route
              path="/result"
              element={<ResultSessions />}
            />

            <Route
              path="/result/:session"
              element={<ResultSearch />}
            />

            <Route
              path="/result-view/:session"
              element={<ResultView />}
            />

          </Route>


          {/* =====================================================
              ADMIN ENTRY
          ===================================================== */}

          <Route
            path="/admin"
            element={<Admin />}
          />


          {/* =====================================================
              ADMIN PANEL
              AdminLayout provides:
              - Admin Header
              - Admin Sidebar
              - Admin Navigation
          ===================================================== */}

          <Route element={<AdminLayout />}>

            {/* Admin Dashboard */}

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            {/* Admin Students */}

            <Route
              path="/admin/students"
              element={<AdminStudents />}
            />

            {/* Admin Student Details */}

            <Route
              path="/admin/students/:studentId"
              element={<AdminStudentDetails />}
            />

            {/* Admin Attendance */}

            <Route
              path="/admin/attendance"
              element={<AdminAttendance />}
            />

            {/* Attendance Report */}

            <Route
              path="/admin/attendance/report"
              element={<AttendanceReport />}
            />

            {/* Admin Fees */}

            <Route
              path="/admin/fees"
              element={<AdminFees />}
            />

            <Route
              path="/admin/fees/history"
              element={<StudentFeeHistory />}
            />


            <Route
              path="/admin/fees/reports"
              element={<FeeReports />}
            />

            <Route
              path="/admin/inventory"
              element={<AdminInventory />}
            />


            {/* Admin Blog */}

            <Route
              path="/admin/blog"
              element={<AdminBlog />}
            />

          </Route>


          {/* =====================================================
              404
          ===================================================== */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;