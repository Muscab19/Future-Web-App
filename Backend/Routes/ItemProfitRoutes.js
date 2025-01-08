const express = require('express');
const Customer = require('../models/Customer'); 
const router = express.Router();

// Route to get all item profits
router.post('/itemProfit', async (req, res) => {
    try {
        const itemProfits = await Customer.find(
            { status: 'Taken' }, 
            'name model itemProfit issue' // Select fields based on your schema
        );

        console.log(itemProfits); // Log the data to see what we're receiving from the database

        if (itemProfits.length === 0) {
            return res.status(404).json({ message: 'No item profits found' });
        }

        // Map to the desired structure
        const formattedProfits = itemProfits.map(item => ({
            customer: item.name,
            item: item.model,
            profitAmount: item.itemProfit || 0, // Make sure profitAmount is a number
            issue: item.issue // Using 'issue' as the issue
        }));

        console.log(formattedProfits); // Log the formatted data being sent back to the frontend

        res.status(200).json(formattedProfits);
    } catch (error) {
        console.error("Error in itemProfit route:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


module.exports = router;