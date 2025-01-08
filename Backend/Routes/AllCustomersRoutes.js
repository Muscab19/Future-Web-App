const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer'); 

// GET all customers
router.post('/allCustomers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single customer by ID
router.get('/allCustomers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new customer
router.post('/allCustomers', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    contact: req.body.contact,
    model: req.body.model,
    budget: req.body.budget,
    itemPrice: req.body.itemPrice,
    time: req.body.time,
    issue: req.body.issue,
    technician: req.body.technician,
    status: req.body.status,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a customer's status by ID
router.patch('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    if (req.body.status) customer.status = req.body.status;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a customer by ID
router.delete('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.remove();
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
