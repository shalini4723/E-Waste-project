import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { VercelRequest, VercelResponse } from '@vercel/node';

import addressRoutes from '../server/addressRoutes';
import brandRoutes from '../server/smartPhoneBrandRoutes';
import laptopbrandRoutes from '../server/LaptopBrandRoutes';
import bookingRoutes from '../server/bookingRoutes';
import accessoriesRoutes from '../server/accessoriesBrandRoutes';
import televisionRoutes from '../server/televisionBrandRoutes';
import refrigeratorRoutes from '../server/refrigeratorBrandRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI not defined in environment');
}

let isConnected = false;

if (!isConnected) {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB connected");
      isConnected = true;
    })
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

// Mount all routes
app.use('/', addressRoutes);
app.use('/', brandRoutes);
app.use('/', laptopbrandRoutes);
app.use('/', accessoriesRoutes);
app.use('/', televisionRoutes);
app.use('/', refrigeratorRoutes);
app.use('/', bookingRoutes);

// Vercel serverless export
export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req as any, res as any);
}
