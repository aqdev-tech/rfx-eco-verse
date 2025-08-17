import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./components/DashboardRedirect";
import Navigation from "./components/Navigation";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import ProfilePage from "./pages/user/ProfilePage";
import WalletPage from "./pages/user/WalletPage";
import GamesPage from "./pages/games/GamesPage";
import CampaignsPage from "./pages/campaigns/CampaignsPage";
import CampaignDetailPage from "./pages/campaigns/CampaignDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ReferralsPage from "./pages/user/ReferralsPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import NFTPage from "./pages/nft/NFTPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import UserManagementPage from "./pages/admin/UserManagementPage";
import CampaignManagementPage from "./pages/admin/CampaignManagementPage";
import AddUserPage from "./pages/admin/AddUserPage";
import AddCampaignPage from "./pages/admin/AddCampaignPage";
import EditUserPage from "./pages/admin/EditUserPage";
import EditCampaignPage from "./pages/admin/EditCampaignPage";
import ReviewSubmissionPage from "./pages/admin/ReviewSubmissionPage";
import AddAdminPage from "./pages/super-admin/AddAdminPage";
import ConfigureSettingsPage from "./pages/super-admin/ConfigureSettingsPage"; // Import ConfigureSettingsPage
import EditAdminPage from "./pages/super-admin/EditAdminPage"; // Import EditAdminPage

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Root route always displays LandingPage */}
              <Route path="/" element={<LandingPage />} />

              {/* Public routes that don't need the Navigation component */}
              <Route path="/landing" element={<LandingPage />} /> {/* Added a dedicated landing route */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* All other routes that need the Navigation component and common layout */}
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const AppLayout = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Routes>
          {/* Public Routes that need Navigation (e.g., About, Contact, Help) */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          
          {/* Dashboard Redirect (can be accessed directly, but usually via /) */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* User Routes */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <WalletPage />
            </ProtectedRoute>
          } />
          <Route path="/games" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <GamesPage />
            </ProtectedRoute>
          } />
          <Route path="/campaigns" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <CampaignsPage />
            </ProtectedRoute>
          } />
          <Route path="/campaigns/:id" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <CampaignDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <LeaderboardPage />
            </ProtectedRoute>
          } />
          <Route path="/referrals" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <ReferralsPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/nft" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <NFTPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
           <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <UserManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/add" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AddUserPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <EditUserPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/campaigns" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <CampaignManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/campaigns/add" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AddCampaignPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/campaigns/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <EditCampaignPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/submissions/review/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <ReviewSubmissionPage />
            </ProtectedRoute>
          } />
          
          {/* Super Admin Routes */}
          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/super-admin/add-admin" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <AddAdminPage />
            </ProtectedRoute>
          } />
          <Route path="/super-admin/platform" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <ConfigureSettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/super-admin/admins/edit/:id" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <EditAdminPage />
            </ProtectedRoute>
          } />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;