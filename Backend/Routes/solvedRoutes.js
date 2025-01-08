const express = require("express");
const Customer = require("../models/Customer"); // Assuming Customer model is used for repair management
const router = express.Router(); 

// Get all solved customer repairs
router.post('/solved', async (req, res) => {
    console.log("Attempting to fetch solved customer repairs");
    try {
        const solvedRepairs = await Customer.find(
            { status: 'Solved' }, 
            'name contact model issue technician budget item'
        );
        console.log("Solved Repairs:", solvedRepairs);

        if (solvedRepairs.length === 0) {
            console.log("No solved repairs found");
            return res.status(200).json([]);
        }

        res.status(200).json(solvedRepairs);
    } catch (error) {
        console.log("Error fetching solved repairs:", error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


// Move a specific customer repair to "Taken" status
router.put('/take/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRepair = await Customer.findByIdAndUpdate(
            id,
            { status: 'Taken' },
            { new: true }
        );

        if (!updatedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }

        res.status(200).json(updatedRepair);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
