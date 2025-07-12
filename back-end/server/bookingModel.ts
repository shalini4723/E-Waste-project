import mongoose, { Schema, Document } from "mongoose";
import Facility from "./FacilityModel";

export interface IBooking extends Document {
  userId: string;
  userEmail: string;
  brand: string;
  recycleItem: string;
  recycleItemPrice: number;
  pickupDate: string;
  pickupTime: string;
  // facility: mongoose.Schema.Types.ObjectId;
  facility: string;
  fullName: string;
  address: string;
  phone: string;
  approvalStatus: "approved" | "rejected" | "pending" | "trashed";
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    brand: { type: String, required: true },
    recycleItem: { type: String, required: true },
    recycleItemPrice: { type: Number, required: true },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    // facility: { type: Schema.Types.ObjectId, ref: "Facility", required: true },
    facility: { type: String },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    approvalStatus: { type: String, enum: ["approved", "rejected", "pending", "trashed"], default: "pending" },
  },
  { timestamps: true }
);

mongoose.model("Facility", Facility.schema);

export default mongoose.model<IBooking>("Booking", BookingSchema);
