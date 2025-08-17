const seedSuperAdmin = require('./superAdminSeeder');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Game = require('../models/Game');
const NFT = require('../models/NFT');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Seed Super Admin
    await seedSuperAdmin();

    // Seed Sample Users (if needed, beyond super admin)
    // const usersCount = await User.countDocuments();
    // if (usersCount === 1) { // Only super admin exists
    //   console.log('Seeding sample users...');
    //   await User.create([
    //     { username: 'testuser1', email: 'user1@example.com', password: 'password123', role: 'user', rfxBalance: 100, co2Saved: 50, xp: 200 },
    //     { username: 'testuser2', email: 'user2@example.com', password: 'password123', role: 'user', rfxBalance: 150, co2Saved: 75, xp: 300 },
    //   ]);
    //   console.log('Sample users seeded.');
    // }

    // Seed Sample Campaigns
    const campaignsCount = await Campaign.countDocuments();
    if (campaignsCount === 0) {
      console.log('Seeding sample campaigns...');
      await Campaign.create([
        {
          title: 'Global Tree Planting Initiative',
          description: 'Join us in planting trees worldwide to combat deforestation.',
          startDate: new Date('2025-09-01'),
          endDate: new Date('2025-12-31'),
          rfxRewardPerAction: 5,
          co2ImpactPerAction: 10,
          targetParticipants: 1000,
          status: 'active',
        },
        {
          title: 'Ocean Cleanup Challenge',
          description: 'Help clean up our oceans and protect marine life.',
          startDate: new Date('2025-10-01'),
          endDate: new Date('2026-01-31'),
          rfxRewardPerAction: 8,
          co2ImpactPerAction: 15,
          targetParticipants: 500,
          status: 'upcoming',
        },
      ]);
      console.log('Sample campaigns seeded.');
    }

    // Seed Sample Games
    const gamesCount = await Game.countDocuments();
    if (gamesCount === 0) {
      console.log('Seeding sample games...');
      await Game.create([
        {
          name: 'Eco-Quiz Challenge',
          description: 'Test your environmental knowledge and earn RFX.',
          genre: 'Educational',
          rfxReward: 2,
          xpReward: 10,
          co2SavedPerPlay: 0.1,
          status: 'active',
        },
        {
          name: 'Recycle Rush',
          description: 'Sort waste quickly and efficiently to earn rewards.',
          genre: 'Puzzle',
          rfxReward: 3,
          xpReward: 15,
          co2SavedPerPlay: 0.2,
          status: 'active',
        },
      ]);
      console.log('Sample games seeded.');
    }

    // Seed Sample NFTs
    const nftsCount = await NFT.countDocuments();
    if (nftsCount === 0) {
      console.log('Seeding sample NFTs...');
      await NFT.create([
        {
          name: 'Digital Tree #001',
          description: 'A unique digital representation of a tree planted.',
          imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=NFT1',
          price: 50,
          currency: 'RFX',
          status: 'available',
        },
        {
          name: 'Ocean Guardian Badge',
          description: 'Awarded for participating in ocean cleanup efforts.',
          imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=NFT2',
          price: 75,
          currency: 'RFX',
          status: 'available',
        },
      ]);
      console.log('Sample NFTs seeded.');
    }

    console.log('Database seeding complete.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};

module.exports = seedDatabase;
