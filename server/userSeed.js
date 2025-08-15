import User from './models/User.js';
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js';
import mongoose from 'mongoose';

// Function to seed the user database
const userRegister = async () => {
  try {
    // Ensure DB is connected before proceeding
    await connectToDatabase();

    // Avoid duplicate admin creation
    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      console.log('Admin user already exists:', { email: existing.email, role: existing.role });
      return;
    }

    const hashPassword = await bcrypt.hash('admin', 10);
    const newUser = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashPassword,
      role: 'admin',
    });
    await newUser.save();
    console.log('Admin user created:', { email: newUser.email });
  } catch (error) {
    console.error('Seed error:', error);
    process.exitCode = 1;
  } finally {
    // Close connection so Node can exit
    await mongoose.disconnect();
  }
};

userRegister();
