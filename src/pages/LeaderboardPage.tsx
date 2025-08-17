import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('xp');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/leaderboard?sortBy=${sortBy}`);
        setLeaderboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortBy]);

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>See top eco-miners and their achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 mb-6">
              <Button onClick={() => setSortBy('xp')} disabled={sortBy === 'xp'}>Sort by XP</Button>
              <Button onClick={() => setSortBy('rfx')} disabled={sortBy === 'rfx'}>Sort by RFX</Button>
              <Button onClick={() => setSortBy('co2')} disabled={sortBy === 'co2'}>Sort by CO2 Saved</Button>
            </div>
            {loading ? (
              <p>Loading leaderboard...</p>
            ) : leaderboardData.length === 0 ? (
              <p>No leaderboard data available.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>XP</TableHead>
                    <TableHead>RFX Balance</TableHead>
                    <TableHead>CO2 Saved (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.xp}</TableCell>
                      <TableCell>{user.rfxBalance}</TableCell>
                      <TableCell>{user.co2Saved}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;