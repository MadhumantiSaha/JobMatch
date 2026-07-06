import { Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Register from "../pages/register";
import ForgetPassword from "../pages/forget-Password";
import VerifyOtp from "../pages/verify-otp";
import ResetPassword from "../pages/reset-password";
import ProtectedRoute from "../components/protectedRoute";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";
import UpdateProfile from "../pages/update-profile";
import AppliedJobs from "../pages/job_seeker/applied-jobs";
import PostJob from "../pages/job_provider/post-job";
import MyJobs from "../pages/job_provider/my-jobs";
import JobDetails from "../pages/job-Details"
import ViewApplicant from "../pages/job_provider/view-applicant"
import Jobs from "../pages/job_seeker/jobs"



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route
        path="/update-profile"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        } />
      <Route path="/job/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
      <Route path="/applied-jobs" element={<ProtectedRoute><AppliedJobs /></ProtectedRoute>} />
      <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
      <Route path="/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
      <Route path="/view-applicants/:jobId" element={<ViewApplicants />} />
      <Route path="jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;