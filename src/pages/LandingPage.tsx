import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Leaf, 
  Users, 
  Trophy, 
  ArrowRight, 
  Play,
  Gamepad2,
  Target,
  Gift,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <header className="container-responsive py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text-primary">RFX EcoVerse</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/help" className="nav-link">How it Works</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-primary hover:opacity-90 glow-primary">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-primary hover:opacity-90 glow-primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container-responsive py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-gradient-secondary text-secondary-foreground glow-secondary">
            <Sparkles className="w-4 h-4 mr-2" />
            Revolutionary Eco-Mining Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Mine <span className="gradient-text-primary">Crypto</span>,{' '}
            <span className="gradient-text-accent">Save Planet</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join the first blockchain platform that rewards environmental action. 
            Earn RFX tokens by participating in eco-campaigns, playing green games, 
            and making a real impact on climate change.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 glow-primary group">
                Start Mining RFX
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="glass-card-hover">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container-responsive py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, label: 'Active Miners', value: '50K+', color: 'primary' },
            { icon: Coins, label: 'RFX Distributed', value: '2.5M', color: 'secondary' },
            { icon: Leaf, label: 'CO₂ Saved (tons)', value: '125K', color: 'accent' },
            { icon: Trophy, label: 'Campaigns Completed', value: '10K+', color: 'warning' },
          ].map((stat, index) => (
            <Card key={index} className="glass-card p-6 text-center animate-fade-in">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 text-${stat.color}`} />
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container-responsive py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="gradient-text-primary">Earn While You</span>{' '}
            <span className="gradient-text-accent">Make Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Multiple ways to mine RFX tokens while contributing to environmental sustainability
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: 'Eco Campaigns',
              description: 'Join real-world environmental campaigns. Upload proof of your green actions and earn RFX tokens.',
              features: ['Tree planting', 'Beach cleanups', 'Recycling drives', 'Energy saving'],
              gradient: 'gradient-primary',
            },
            {
              icon: Gamepad2,
              title: 'Green Gaming',
              description: 'Play educational games about sustainability. Learn while you earn through our gamified platform.',
              features: ['Recycle Rush', 'Trash Sort', 'Blockchain Trivia', 'Upcycle Builder'],
              gradient: 'gradient-secondary',
            },
            {
              icon: Gift,
              title: 'Referral Rewards',
              description: 'Invite friends to join the eco-revolution. Earn bonus RFX tokens for every successful referral.',
              features: ['Unique referral codes', 'Tier-based rewards', 'Lifetime bonuses', 'Team challenges'],
              gradient: 'gradient-accent',
            },
          ].map((feature, index) => (
            <Card key={index} className="glass-card p-8 hover:scale-105 transition-all duration-300 animate-fade-in">
              <div className={`w-16 h-16 bg-${feature.gradient} rounded-xl flex items-center justify-center mb-6 glow-primary`}>
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <ChevronRight className="w-4 h-4 mr-2 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-responsive py-20">
        <Card className="glass-card p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="gradient-text-primary">Start Mining</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of eco-miners already earning RFX tokens while making a positive impact on our planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 glow-primary">
                Create Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="glass-card-hover">
                Already have an account?
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container-responsive py-12 border-t border-border">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold gradient-text-primary">RFX EcoVerse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Mining cryptocurrency while saving the planet, one campaign at a time.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              <li><Link to="/campaigns" className="hover:text-primary">Campaigns</Link></li>
              <li><Link to="/games" className="hover:text-primary">Games</Link></li>
              <li><Link to="/leaderboard" className="hover:text-primary">Leaderboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary">Whitepaper</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2024 RFX EcoVerse. All rights reserved. Built for a sustainable future.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;