import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast'; // Import useToast
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import {
  Crown,
  Users,
  Target,
  Gamepad2,
  Settings,
  BarChart3,
  TrendingUp,
  DollarSign,
  Shield,
  Activity,
  // Removed Database, Globe, Lock, AlertTriangle imports
  Zap,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface SuperAdminDashboardData {
  totalPlatformUsers: number;
  newUsersLastMonthPercentage: number;
  rfxTokensDistributed: number;
  platformRevenueMonthly: number;
  systemUptimePercentage: number;
  dailyRewardAmount: number;
  campaignRewardLimit: number;
  referralBonus: number;
  maintenanceMode: string;
  // Removed database, global activity, security status, and alerts fields
}

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast(); // Initialize useToast
  const [dashboardData, setDashboardData] = useState<SuperAdminDashboardData | null>(null);
  const [settings, setSettings] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    if (!user || user.role !== 'super_admin') {
      setIsLoading(false);
      setError('You don\'t have permission to access this page.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardResponse, settingsResponse, adminsResponse] = await Promise.all([
        axios.get<SuperAdminDashboardData>(`${API_BASE_URL}/super-admin/dashboard-summary`),
        axios.get(`${API_BASE_URL}/super-admin/settings`),
        axios.get(`${API_BASE_URL}/super-admin/admins`)
      ]);
      setDashboardData(dashboardResponse.data);
      setSettings(settingsResponse.data);
      setAdmins(adminsResponse.data);
    } catch (err: any) {
      console.error('Failed to fetch super admin dashboard data:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user]);

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/super-admin/admins/${adminId}`);
      fetchAllData(); // Refresh data
      toast({
        title: "Admin Removed",
        description: "Admin role has been successfully removed.",
        variant: "success",
      });
    } catch (error: any) {
      console.error('Error removing admin:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to remove admin.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Loading Super Admin Dashboard...</CardTitle>
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

  if (!user || user.role !== 'super_admin') {
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
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Crown className="w-8 h-8 mr-3 text-accent" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Platform-wide control and analytics. Manage all aspects of RFX EcoVerse.
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card glow-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Platform Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.totalPlatformUsers}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +{dashboardData?.newUsersLastMonthPercentage}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RFX Tokens Distributed</CardTitle>
              <Zap className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.rfxTokensDistributed / 1000000}M</div>
              <p className="text-xs text-muted-foreground">
                Total ecosystem circulation
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(dashboardData?.platformRevenueMonthly / 1000).toFixed(1)}K</div>
              <p className="text-xs text-muted-foreground">
                Monthly recurring revenue
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-success">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{dashboardData?.systemUptimePercentage}%</div>
              <p className="text-xs text-muted-foreground">
                Uptime this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Platform Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Platform Settings
                </span>
                <Link to="/super-admin/platform">
                  <Button size="sm" className="bg-gradient-accent hover:opacity-90">
                    <Edit className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.map((setting: any) => (
                  <div key={setting._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{setting.key}</p>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <Badge variant="outline">{setting.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Management
                </span>
                <Link to="/super-admin/add-admin">
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Admin
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {admins.map((admin: any) => (
                  <div key={admin._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{admin.username}</p>
                      <p className="text-xs text-muted-foreground">{admin.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className="text-xs"
                      >
                        {admin.role}
                      </Badge>
                      <Link to={`/super-admin/admins/edit/${admin._id}`}>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-3 h-3" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="ghost" onClick={() => handleRemoveAdmin(admin._id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Removed System Analytics, Global Activity, Security Status, and Platform Alerts sections */}

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
