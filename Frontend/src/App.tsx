import { Toaster } from "@/components/ui/toaster"; 
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Navbar
import { Navbar } from "./components/Navbar";

// pages
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AddCertificate from "./pages/AddCertificate";
import AdminStudents from "./pages/AdminStudents";
import AdminStudentDetails from "./pages/AdminStudentDetails";
import AdminDashboard from "./pages/AdminDashboard";


import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Index from "./pages/Index";
import AdminBlog from "./pages/Admin";

// ✅ NEW Student Corner Pages
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Competition from "./pages/Competition";
import Lathi from "./pages/Lathi";
import Nunchaku from "./pages/Nunchaku";
import HelpDesk from "./pages/HelpDesk";
import CompetitionDetails from "./pages/CompetitionDetails";

// import helpdesk



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>

        {/* ✅ Navbar added globally */}
        <Navbar />

        <Routes>

          {/* main landing page */}
          <Route path="/" element={<Index />} />

          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          

          {/* student dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddCertificate />} />

          {/* admin */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:studentId" element={<AdminStudentDetails />} />
          <Route path="/admin/students/:studentId" element={<AdminStudentDetails />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />


          {/* 🔥 BLOG ROUTES */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/admin/blog" element={<AdminBlog />} />

          {/* ✅ STUDENT CORNER ROUTES */}
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/competition" element={<Competition />} />
          <Route path="/lathi" element={<Lathi />} />
          <Route path="/nunchaku" element={<Nunchaku />} />
          <Route path="/help" element={<HelpDesk />} />
           <Route path="/competition/:id" element={<CompetitionDetails />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;