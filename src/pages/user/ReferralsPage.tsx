import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ReferralsPage = () => {
  const { user } = useAuth();
  const [referralsData, setReferralsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferralsData = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/user/referrals');
          setReferralsData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching referrals data:', error);
          setLoading(false);
        }
      }
    };

    fetchReferralsData();
  }, [user]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralsData.referralLink);
  };

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Invite friends and earn bonus RFX tokens</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading referrals data...</p>
            ) : referralsData ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">Your Referral Code: {referralsData.referralCode}</h2>
                  <div className="flex items-center mt-2">
                    <Input type="text" value={referralsData.referralLink} readOnly />
                    <Button onClick={copyToClipboard} className="ml-2">Copy Link</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold">Referred Users</h3>
                    <p>{referralsData.referredUsersCount}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Total Earned from Referrals</h3>
                    <p>{referralsData.totalEarnedFromReferrals.toFixed(2)} RFX</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">Referred Users List</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Joined At</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralsData.referredUsers.map((referredUser) => (
                      <TableRow key={referredUser.id}>
                        <TableCell>{referredUser.username}</TableCell>
                        <TableCell>{new Date(referredUser.joinedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{referredUser.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>No referrals data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralsPage;