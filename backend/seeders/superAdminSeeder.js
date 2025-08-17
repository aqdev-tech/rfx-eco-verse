const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const seedSuperAdmin = async () => {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      console.warn('SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set in .env. Skipping super admin seeding.');
      return;
    }

    const superAdminExists = await User.findOne({ email: superAdminEmail });

    if (!superAdminExists) {
      await User.create({
        username: 'SuperAdmin',
        email: superAdminEmail,
        password: superAdminPassword,
        role: 'super_admin',
      });
      console.log('Super admin user created successfully.');
    } else {
      console.log('Super admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding super admin:', error);
  }
};

module.exports = seedSuperAdmin;