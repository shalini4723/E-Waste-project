import express, { Request, Response } from "express";
import Booking, { IBooking } from "./bookingModel";
import mongoose from "mongoose";

const router = express.Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { facility, brand, ...otherBookingData } = req.body;
    if (!mongoose.Types.ObjectId.isValid(facility)) {
      return res.status(400).json({ message: "Invalid facility ID" });
    }
    if (!brand) {
      return res.status(400).json({ message: "Brand is required" });
    }
    const newBooking = new Booking({
      ...otherBookingData,
      brand,
      facility: new mongoose.Types.ObjectId(facility),
    });
    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", data: newBooking });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ approvalStatus: { $ne: "trashed" } }).populate({
      path: "facility",
      select: "name location",
    });
    res.status(200).json(bookings);
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid booking ID" });
    }
    const booking = await Booking.findById(id).populate({
      path: "facility",
      select: "name location",
    });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking updated successfully", data: updatedBooking });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
});

router.get("/bookings/approved", async (req: Request, res: Response) => {
  try {
    const approvedBookings = await Booking.find({ approvalStatus: "approved" }).populate("facility");
    res.status(200).json(approvedBookings);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching approved bookings", error: error.message });
  }
});

router.get("/bookings/rejected", async (req: Request, res: Response) => {
  try {
    const rejectedBookings = await Booking.find({ approvalStatus: "rejected" }).populate("facility");
    res.status(200).json(rejectedBookings);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching rejected bookings", error: error.message });
  }
});

router.get("/bookings/trashed", async (req: Request, res: Response) => {
  try {
    const trashedBookings = await Booking.find({ approvalStatus: "trashed" }).populate("facility");
    res.status(200).json(trashedBookings);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching trashed bookings", error: error.message });
  }
});

router.put("/:id/approval", async (req: Request, res: Response) => {
  try {
    const { approvalStatus } = req.body;
    if (!["approved", "rejected", "trashed"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status" });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({
      message: approvalStatus === "trashed" ? "Booking moved to trash" : `Booking ${approvalStatus}`,
      data: updatedBooking
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating approval status", error: error.message });
  }
});

router.put("/:id/restore", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.approvalStatus !== "trashed") {
      return res.status(400).json({ message: "Booking is not in trash" });
    }
    booking.approvalStatus = "pending";
    await booking.save();
    res.status(200).json({ message: "Booking restored successfully", data: booking });
  } catch (error: any) {
    res.status(500).json({ message: "Error restoring booking", error: error.message });
  }
});


export default router;