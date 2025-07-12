import express from 'express';
import Address from './addressModel';

const router = express.Router();

router.post('/add-address', async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/addresses', async (req, res) => {
  try {
    const addresses = await Address.find();
    res.json(addresses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/address/:id', async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/address/:id', async (req, res) => {
  try {
    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedAddress) return res.status(404).json({ message: "Address not found" });
    res.json(updatedAddress);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/address/:id', async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);
    if (!deletedAddress) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Address deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
