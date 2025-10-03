import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";

import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Payments from "./pages/admin/Payments";
import Users from "./pages/admin/Users";
import Profile from "./pages/admin/Profile";
import LoginPage from "./pages/admin/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEmployeeForm from "./pages/admin/AddEmployeeForm";
import Employees from "./pages/admin/Employees";
import Vendors from "./pages/admin/Vendors";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          <Route path="/" element={<AdminLayout><LoginPage /></AdminLayout>} />
          <Route path="/addEmployee" element={<AdminLayout><ProtectedRoute><AddEmployeeForm /></ProtectedRoute></AdminLayout>} />
          <Route path="/dashboard" element={<AdminLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AdminLayout>} />
          <Route path="/services" element={<AdminLayout><ProtectedRoute><Orders /></ProtectedRoute></AdminLayout>} />
          <Route path="/payments" element={<AdminLayout><ProtectedRoute><Payments /></ProtectedRoute></AdminLayout>} />
          <Route path="/users" element={<AdminLayout><ProtectedRoute><Users /></ProtectedRoute></AdminLayout>} />
           <Route path="/employees" element={<AdminLayout><ProtectedRoute><Employees /></ProtectedRoute></AdminLayout>} />
          <Route path="/profile" element={<AdminLayout><ProtectedRoute><Profile /></ProtectedRoute></AdminLayout>} />
          <Route path="/vendors" element={<AdminLayout><ProtectedRoute><Vendors /></ProtectedRoute></AdminLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
