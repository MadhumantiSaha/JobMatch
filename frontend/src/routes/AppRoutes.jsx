import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ForgetPassword from "../pages/auth/forget-Password";
import VerifyOtp from "../pages/auth/verify-otp";
import ResetPassword from "../pages/auth/reset-password";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../pages/profile";
import UpdateProfile from "../pages/update-profile";
import AppliedJobs from "../pages/job_seeker/applied-jobs";
import PostJob from "../pages/job_provider/post-job";
import MyJobs from "../pages/job_provider/my-jobs";
import JobDetails from "../pages/job-details";
import ViewApplicant from "../pages/job_provider/view-applicant";
import Jobs from "../pages/job_seeker/jobs";
import PremiumPlans from "../pages/job_seeker/premium-plans";
import Messages from "../pages/messages";
import Analytics from "../pages/job_provider/analytics";
import ApplicantsAggregate from "../pages/job_provider/applicants-aggregate";
import Notifications from "../pages/job_provider/notifications";
import CandidateLanding from "../pages/landing/CandidateLanding";
import RecruiterLanding from "../pages/landing/RecruiterLanding";



function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidateLanding />} />
      <Route path="/employers" element={<RecruiterLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      
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
      <Route path="jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/premium" element={<PremiumPlans />} />

      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>}/>
      
      <Route path="/view-applicant/:jobId" element={<ProtectedRoute><ViewApplicant /></ProtectedRoute> } />
      <Route path="/view-applicants/:jobId" element={<ProtectedRoute><ViewApplicant /></ProtectedRoute>} />

      {/* Sidebar destinations */}
      <Route path="/provider/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route
        path="/provider/all-applicants"
        element={
          <ProtectedRoute>
            <ApplicantsAggregate
              icon="👥"
              title="All Applicants"
              subtitle="Every applicant across every job you've posted"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/shortlisted"
        element={
          <ProtectedRoute>
            <ApplicantsAggregate
              icon="⭐"
              title="Shortlisted"
              subtitle="Applicants you've shortlisted, across every job"
              lockedStatus="SHORTLISTED"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/interviews"
        element={
          <ProtectedRoute>
            <ApplicantsAggregate
              icon="🗓️"
              title="Interviews"
              subtitle="Applicants currently in the interview stage"
              lockedStatus="INTERVIEW"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;