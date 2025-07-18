// server/app.ts or server/index.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import addressRoutes from './addressRoutes';
import brandRoutes from './smartPhoneBrandRoutes';
import laptopbrandRoutes from './LaptopBrandRoutes';
import bookingRoutes from './bookingRoutes';
import accessoriesRoutes from './accessoriesBrandRoutes';
import televisionRoutes from './televisionBrandRoutes';
import refrigeratorRoutes from './refrigeratorBrandRoutes';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('❌ MONGO_URI not defined in .env');

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


  const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get('/ping', (req, res) => {
  res.send('pong');
});


// Routes
app.use('/', addressRoutes);
app.use('/', brandRoutes);
app.use('/', laptopbrandRoutes);
app.use('/', accessoriesRoutes);
app.use('/', televisionRoutes);
app.use('/', refrigeratorRoutes);
app.use('/', bookingRoutes);

export default app;
