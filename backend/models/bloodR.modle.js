import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  bloodType: {
    type: String,
    required: true
  },
  emergencyLevel: {
    type: String,
    enum: ["Low", "Medium", "Critical"],
    required: true
  },
  requiredUnits: {
    type: Number,
    required: true
  },
  hospitalAddress: {
    type: String,
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    default: null
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Completed"],
    default: "Pending"
  }
}, { timestamps: true });

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);
export default BloodRequest;