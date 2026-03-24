import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
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
  approved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;