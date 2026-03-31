import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true
  },
  bloodRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodRequest",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
