const express = require('express');
const Customer = require('../models/Customer'); // Assuming "Customer" model is used for repairs
const router = express.Router();

// Route to mark a repair as "Taken"
router.put('/taken/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRepair = await Customer.findByIdAndUpdate(
            id,
            { status: 'Taken', dateTaken: new Date() },
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

// Route to get all repairs marked as "Taken"
router.post('/taken', async (req, res) => {
  try {
    const takenRepairs = await Customer.find(
      { status: 'Taken' }, // Ensures status is 'Taken'
      'name contact model issue serviceFee itemCost itemProfit createdAt' // Select only necessary fields
    );

    if (takenRepairs.length === 0) {
      return res.status(404).json({ message: 'No taken repairs found' });
    }

    res.status(200).json(takenRepairs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


// Route to delete a repair marked as "Taken"
router.delete('/taken/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRepair = await Customer.findByIdAndDelete(id);

        if (!deletedRepair) {
            return res.status(404).json({ message: 'Repair not found' });
        }

        res.status(200).json({ message: "Repair deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
