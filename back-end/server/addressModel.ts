import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  contact: { type: String, required: true },
  time: { type: String, required: true },
  verified: { type: Boolean, default: false },
  address: { type: String, required: true }
}, { timestamps: true });


const Address = mongoose.model('Address', addressSchema);
export default Address;