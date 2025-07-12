// server.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import addressRoutes from './addressRoutes';
import cors from "cors";
import brandRoutes from './smartPhoneBrandRoutes';
import laptopbrandRoutes from "./LaptopBrandRoutes";
import bookingRoutes from './bookingRoutes';
import accessoriesRoutes from './accessoriesBrandRoutes';
import televisionRoutes from './televisionBrandRoutes';
import refrigeratorRoutes from './refrigeratorBrandRoutes';

dotenv.config();

const app = express();
app.use(express.json());
// const app = express();

app.use(cors());
// app.use(express.json()); 

// Ensure MONGO_URI is defined
// const MONGO_URI = process.env.MONGO_URI;
// const MONGO_URI = "mongodb+srv://ragunath0407:Ragunath@#123@cluster0.1l6vk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const MONGO_URI = "mongodb+srv://ragunath0407:Ragunath%40%23123@cluster0.1l6vk.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0";

const MONGO_URI = "mongodb+srv://ewaste341:Ragu0423@cluster0.hqzylxk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use('/', addressRoutes);
app.use('/', brandRoutes);
app.use('/', laptopbrandRoutes);
app.use('/', accessoriesRoutes);
app.use('/', televisionRoutes);
app.use('/', refrigeratorRoutes)
app.use('/', bookingRoutes);

// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 5001; 

app.listen(5001, () => {
  console.log("Server running on port 5001");
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });