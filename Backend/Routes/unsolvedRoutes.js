const express = require("express");
const Customer = require("../models/Customer"); // Import Customer model
const router = express.Router();

// @desc Mark a device as unsolved
router.put('/unsolved/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRepair = await Customer.findByIdAndUpdate(  // Use Customer model here
            id,
            { status: 'Unsolved' },
            { new: true }
        );

        if (!updatedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }

        res.status(200).json(updatedRepair); // Return the updated repair
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc Get all unsolved devices
router.post('/unsolved', async (req, res) => {
    try {
        const unsolvedRepairs = await Customer.find({ status: 'Unsolved' }); // Use Customer model here

        if (unsolvedRepairs.length === 0) {
            return res.status(404).json({ message: 'No unsolved repairs found' });
        }

        res.status(200).json(unsolvedRepairs); // Return the list of unsolved repairs
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc Delete an unsolved repair
router.delete('/unsolved/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRepair = await Customer.findByIdAndDelete(id); // Use Customer model here

        if (!deletedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }

        res.status(200).json({ message: "Repair deleted successfully" });
    } catch (error) {
        console.log("Error deleting repair:", error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
