import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NFTPage = () => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const response = await axios.get('/api/nfts?type=marketplace');
        setNfts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setLoading(false);
      }
    };

    fetchNfts();
  }, []);

  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>RFXVerse NFTs</CardTitle>
            <CardDescription>Collect and trade environmental NFTs</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading NFTs...</p>
            ) : nfts.length === 0 ? (
              <p>No NFTs available in the marketplace right now.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <Card key={nft._id} className="glass-card-secondary">
                    <CardHeader>
                      <img src={nft.imageUrl} alt={nft.name} className="rounded-lg mb-4" />
                      <CardTitle>{nft.name}</CardTitle>
                      <CardDescription>{nft.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="font-bold">{nft.price} RFX</p>
                        <Button>Buy Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NFTPage;