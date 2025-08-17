import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Coins, 
  Leaf, 
  Trophy, 
  Target, 
  Users, 
  Gift,
  TrendingUp,
  Calendar,
  Gamepad2,
  Award,
  ArrowUpRight
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface UserDashboardData {
  rfxBalance: number;
  co2Saved: number;
  level: number;
  xp: number;
  achievementsCount: number;
  activeCampaigns: { id: string; title: string; status: string; }[];
  newGames: { id: string; name: string; status: string; }[];
  referralBonusInfo: { amount: number; currency: string; };
  recentActivity: { action: string; reward: string; time: string; type: string; }[];
}

const UserDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<UserDashboardData>(`${API_BASE_URL}/user/dashboard-summary`);
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Failed to fetch user dashboard data:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Loading Dashboard...</CardTitle>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Error Loading Dashboard</CardTitle>
          <CardDescription>{error}</CardDescription>
        </Card>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="min-h-screen animated-bg p-6 flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <CardTitle className="text-2xl mb-4">Please log in to view your dashboard.</CardTitle>
          <Link to="/login"><Button>Login</Button></Link>
        </Card>
      </div>
    );
  }

  const xpToNextLevel = 1000; // Assuming 1000 XP per level for simplicity
  const currentXP = dashboardData.xp % xpToNextLevel;
  const xpProgress = (currentXP / xpToNextLevel) * 100;

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text-primary">{user.username}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Your eco-mining dashboard. Track your progress and impact.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card glow-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RFX Balance</CardTitle>
              <Coins className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.rfxBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12.5% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Leaf className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.co2Saved} kg</div>
              <p className="text-xs text-muted-foreground">
                Environmental impact
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glow-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Trophy className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {dashboardData.level}</div>
              <div className="mt-2">
                <Progress value={xpProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {currentXP}/{xpToNextLevel} XP to next level
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.achievementsCount}</div>
              <p className="text-xs text-muted-foreground">
                Eco-milestones reached
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary" />
                Active Campaigns
              </CardTitle>
              <CardDescription>Join environmental campaigns and earn RFX</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.activeCampaigns.length > 0 ? (
                  dashboardData.activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <span className="text-sm">{campaign.title}</span>
                      <Badge variant="outline">{campaign.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No active campaigns.</p>
                )}
              </div>
              <Link to="/campaigns">
                <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90">
                  View All Campaigns
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gamepad2 className="w-5 h-5 mr-2 text-secondary" />
                Eco Games
              </CardTitle>
              <CardDescription>Play games to learn and earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.newGames.length > 0 ? (
                  dashboardData.newGames.map((game) => (
                    <div key={game.id} className="flex items-center justify-between">
                      <span className="text-sm">{game.name}</span>
                      <Badge className="bg-secondary/20 text-secondary">{game.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No new games.</p>
                )}
              </div>
              <Link to="/games">
                <Button className="w-full mt-4 bg-gradient-secondary hover:opacity-90">
                  Play Games
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-accent" />
                Referral Program
              </CardTitle>
              <CardDescription>Invite friends and earn bonus RFX</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-accent">+{dashboardData.referralBonusInfo.amount} {dashboardData.referralBonusInfo.currency}</div>
                <p className="text-sm text-muted-foreground">per successful referral</p>
              </div>
              <Link to="/referrals">
                <Button className="w-full mt-4 bg-gradient-accent hover:opacity-90">
                  Start Referring
                  <Gift className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleString()}</p>
                    </div>
                    <Badge 
                      className={
                        activity.type === 'campaign' ? 'bg-primary/20 text-primary' :
                        activity.type === 'game' ? 'bg-secondary/20 text-secondary' :
                        activity.type === 'referral' ? 'bg-accent/20 text-accent' :
                        'bg-warning/20 text-warning'
                      }
                    >
                      {activity.reward}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
