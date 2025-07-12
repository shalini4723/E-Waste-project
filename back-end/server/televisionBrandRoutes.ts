import express, { Request, Response } from "express";
import TelevisionBrand, { IBrand } from "./televisionBrandModel";

const router = express.Router();

router.post("/television-brands", async (req: Request, res: Response) => {
  try {
    const { brand, models } = req.body;
    const newBrand: IBrand = new TelevisionBrand({ brand, models });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/television-brands", async (_req: Request, res: Response) => {
  try {
    const brands = await TelevisionBrand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/television-brands/:brand", async (req: Request, res: Response) => {
  try {
    const brand = await TelevisionBrand.findOne({ brand: req.params.brand });
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand.models);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
