import express, { Request, Response } from "express";
import Brand, { IBrand } from './smartPhoneBrandModel';

const router = express.Router();

router.post("/brands", async (req: Request, res: Response) => {
  try {
    const { brand, models } = req.body;
    const newBrand: IBrand = new Brand({ brand, models });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/brands", async (req: Request, res: Response) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/brands/:brand", async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findOne({ brand: req.params.brand });
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand.models);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
