import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen animated-bg p-6">
      <div className="container-responsive">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>About RFX EcoVerse</CardTitle>
            <CardDescription>Learn about our mission to save the planet</CardDescription>
          </CardHeader>
          <CardContent>
            <p>About page coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;