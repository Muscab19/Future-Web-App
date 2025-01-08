const express = require('express');
const Customer = require('../models/Customer'); // Import the Customer model
const router = express.Router();

// @desc Add a new customer repair entry
router.post('/customers', async (req, res) => {

    console.log("response", req)
    const { name, contact, model, time, issue, serviceFee, itemCost, itemProfit } = req.body;

    try {
        const newCustomer = new Customer({
            name,
            contact,
            model,
            time,
            issue,
            serviceFee,
            itemCost,
            itemProfit
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        console.log("Error saving to MongoDB:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc Get all customer repair entries
router.post('/getCustomers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc Update a specific customer’s repair status to Solved
router.put('/customers/:id/solve', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { status: "Solved" },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Repair marked as solved", customer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
});

// @desc Delete a customer repair entry
router.delete('/customers/:id', async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Customer deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
});

module.exports = router;
