require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // New import
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const campaignRoutes = require('./routes/campaign');
const nftRoutes = require('./routes/nft');
const leaderboardRoutes = require('./routes/leaderboard');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/superAdmin');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
const seedDatabase = require('./seeders');

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    seedDatabase(); // Call the main seeder after successful connection
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('RFX EcoVerse Backend is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);

// Error Handling Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
