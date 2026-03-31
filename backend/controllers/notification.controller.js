import Notification from "../models/notification.model.js";

// Get all notifications for the logged-in donor
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ donorId: req.user._id })
            .populate("bloodRequestId", "patientName bloodType emergencyLevel requiredUnits hospitalAddress status")
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ donorId: req.user._id, read: false });
        res.status(200).json({ count });
    } catch (error) {
        console.log("Error in getUnreadCount:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, donorId: req.user._id },
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.status(200).json(notification);
    } catch (error) {
        console.log("Error in markAsRead:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { donorId: req.user._id, read: false },
            { read: true }
        );
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.log("Error in markAllAsRead:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
