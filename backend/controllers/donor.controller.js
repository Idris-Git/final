import Donor from "../models/donor.model.js";
import BloodRequest from "../models/bloodR.modle.js";

// Update availability status (active/inactive)
export const updateStatus = async (req, res) => {
    try {
        const { active } = req.body;
        if (typeof active !== "boolean") {
            return res.status(400).json({ error: "Active must be true or false" });
        }

        const donor = await Donor.findByIdAndUpdate(
            req.user._id,
            { active },
            { new: true }
        ).select("-password");

        res.status(200).json(donor);
    } catch (error) {
        console.log("Error in updateStatus:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// View matching blood requests (same blood type, pending status)
export const getMatchingRequests = async (req, res) => {
    try {
        const donor = req.user;
        const requests = await BloodRequest.find({
            bloodType: donor.bloodType,
            status: "Pending"
        })
            .populate("hospitalId", "name address contact")
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.log("Error in getMatchingRequests:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Accept a blood request
export const acceptRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }
        if (request.status !== "Pending") {
            return res.status(400).json({ error: "Request is no longer pending" });
        }

        // Check if donor's blood type matches
        if (request.bloodType !== req.user.bloodType) {
            return res.status(400).json({ error: "Blood type does not match" });
        }

        // Check cooldown (3 months since last donation)
        if (req.user.lastDonationDate) {
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            if (req.user.lastDonationDate > threeMonthsAgo) {
                return res.status(400).json({ error: "You are still in cooldown period (3 months since last donation)" });
            }
        }

        request.donorId = req.user._id;
        request.status = "Accepted";
        await request.save();

        res.status(200).json(request);
    } catch (error) {
        console.log("Error in acceptRequest:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// View donation history
export const getDonationHistory = async (req, res) => {
    try {
        const donations = await BloodRequest.find({
            donorId: req.user._id,
            status: { $in: ["Accepted", "Completed"] }
        })
            .populate("hospitalId", "name address")
            .sort({ createdAt: -1 });

        res.status(200).json(donations);
    } catch (error) {
        console.log("Error in getDonationHistory:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
