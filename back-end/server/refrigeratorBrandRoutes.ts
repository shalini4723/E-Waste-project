import express, { Request, Response } from "express";
import RefrigeratorBrand, { IBrand } from "./refrigeratorBrandModel";

const router = express.Router();

router.post("/refrigerator-brands", async (req: Request, res: Response) => {
  try {
    const { brand, models } = req.body;
    const newBrand: IBrand = new RefrigeratorBrand({ brand, models });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/refrigerator-brands", async (_req: Request, res: Response) => {
  try {
    const brands = await RefrigeratorBrand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/refrigerator-brands/:brand", async (req: Request, res: Response) => {
  try {
    const brand = await RefrigeratorBrand.findOne({ brand: req.params.brand });
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand.models);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


export default router;
