import mongoose from "mongoose";

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  lastDonationDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });
const Donor = mongoose.model("Donor", donorSchema);
export default Donor;