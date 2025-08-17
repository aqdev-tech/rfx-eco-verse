import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const WalletPage = () => {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/user/wallet');
          setWalletData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching wallet data:', error);
          setLoading(false);
        }
      }
    };

    fetchWalletData();
  }, [user]);

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>Manage your RFX tokens and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading wallet data...</p>
            ) : walletData ? (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold">RFX Balance: {walletData.rfxBalance !== undefined ? walletData.rfxBalance.toFixed(2) : 'N/A'}</h2>
                </div>
                <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walletData.transactions && walletData.transactions.length > 0 ? (
                      walletData.transactions.map((tx) => (
                        <TableRow key={tx._id}>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell>{tx.description}</TableCell>
                          <TableCell>{tx.amount.toFixed(2)} {tx.currency}</TableCell>
                          <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No transactions found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>No wallet data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;