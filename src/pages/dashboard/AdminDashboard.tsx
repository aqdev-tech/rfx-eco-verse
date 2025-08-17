import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Added Link import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface AdminDashboardData {
  totalUsers: number;
  newUsersLastMonthPercentage: number;
  activeCampaignsCount: number;
  pendingCampaignApprovalsCount: number;
  pendingReviewsCount: number;
  completedSubmissionsTodayCount: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      setIsLoading(false);
      setError('You don\'t have permission to access this page.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardResponse, usersResponse, campaignsResponse, submissionsResponse] = await Promise.all([
        axios.get<AdminDashboardData>(`${API_BASE_URL}/admin/dashboard-summary`),
        axios.get(`${API_BASE_URL}/admin/users`),
        axios.get(`${API_BASE_URL}/admin/campaigns`),
        axios.get(`${API_BASE_URL}/admin/submissions/pending`)
      ]);
      setDashboardData(dashboardResponse.data);
      setUsers(usersResponse.data);
      setCampaigns(campaignsResponse.data);
      setSubmissions(submissionsResponse.data);
    } catch (err: any) {
      console.error('Failed to fetch admin dashboard data:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSubmission = async (submissionId: string) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/submissions/${submissionId}/approve`);
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/submissions/${submissionId}/reject`);
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Loading Admin Dashboard...</CardTitle>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Access Denied</CardTitle>
          <CardDescription>{error}</CardDescription>
        </Card>
      </div>
    );
  }

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Access Denied</CardTitle>
          <CardDescription>You don\'t have permission to access this page.</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Admin Dashboard 🛠️
          </h1>
          <p className="text-muted-foreground">
            Manage users, campaigns, and platform analytics.
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card glow-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +{dashboardData?.newUsersLastMonthPercentage}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Target className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.activeCampaignsCount}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.pendingCampaignApprovalsCount} pending approval
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <AlertCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.pendingReviewsCount}</div>
              <p className="text-xs text-muted-foreground">
                User submissions
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.completedSubmissionsTodayCount}</div>
              <p className="text-xs text-muted-foreground">
                Campaign submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </span>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-1" />
                  Add User
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.slice(0, 3).map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className="text-xs"
                      >
                        {user.role}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full mt-4">
                  View All Users
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Campaign Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Campaign Management
                </span>
                <Link to="/admin/campaigns/add">
                  <Button size="sm" className="bg-gradient-secondary hover:opacity-90">
                    <Plus className="w-4 h-4 mr-1" />
                    New Campaign
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {campaigns.slice(0, 3).map((campaign: any) => (
                  <div key={campaign._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{campaign.title}</p>
                      <p className="text-xs text-muted-foreground">{campaign.participantsCount} participants</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          campaign.status === 'active' ? 'default' :
                          campaign.status === 'pending' ? 'secondary' :
                          'outline'
                        }
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/campaigns">
                <Button variant="outline" className="w-full mt-4">
                  View All Campaigns
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Pending Approvals
            </CardTitle>
            <CardDescription>User submissions requiring review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission: any) => (
                <div key={submission._id} className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{submission.user.username} - {submission.campaign.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-gradient-accent hover:opacity-90" onClick={() => handleApproveSubmission(submission._id)}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Link to={`/admin/submissions/review/${submission._id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Review
                      </Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => handleRejectSubmission(submission._id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
