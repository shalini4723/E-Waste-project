import mongoose, { Schema, Document } from "mongoose";

export interface IFacility extends Document {
  name: string;
  location: string;
}

const FacilitySchema = new Schema<IFacility>({
  name: { type: String, required: true },
  location: { type: String, required: true },
});

const Facility = mongoose.model<IFacility>("Facility", FacilitySchema);
export default Facility;
