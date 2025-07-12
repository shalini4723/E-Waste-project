import mongoose, { Schema, Document } from "mongoose";

export interface IBrand extends Document {
  brand: string;
  models: string[];
}

const BrandSchema: Schema = new Schema({
  brand: { type: String, required: true, unique: true },
  models: [{ type: String, required: true }],
});

export default mongoose.model<IBrand>("AccessoriesBrand", BrandSchema);

