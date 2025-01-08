const express = require('express');
const router = express.Router();
const Inventory = require('../models/InventoryModel');

// Get all inventory items
router.get('/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/inventory/decrease/:name', async (req, res) => {
  try {
    const itemName = req.params.name;  // Use name instead of id
    const item = await Inventory.findOne({ name: itemName });

    if (!item) {
      console.error(`Item with name ${itemName} not found.`);
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.qty <= 0) {
      console.error(`Insufficient stock for item ${item.name}`);
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.qty -= 1;  // Decrease quantity by 1
    await item.save();

    console.log(`Item ${item.name} quantity decreased successfully.`);
    res.json(item);  // Send the updated item back
  } catch (err) {
    console.error('Error decreasing item quantity:', err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/newItem', async (req, res) => {
  const { name, qty, cost } = req.body;

  // Log the received data
  console.log('Received Data:', req.body);

  try {
    // Basic validation
    if (!name || qty == null || cost == null) {
      console.log('Validation Failed: Missing fields');
      return res.status(400).json({ message: 'Name, quantity, and cost are required' });
    }

    // // Additional validation for data types
    // if (typeof qty !== 'number' || typeof cost !== 'number') {
    //   console.log('Validation Failed: Invalid data types');
    //   return res.status(400).json({ message: 'Quantity and cost must be numbers' });
    // }

    const newItem = new Inventory({ name, qty, cost });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});


// Update item by ID
router.put('/inventory/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete item by ID
router.delete('/inventory/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
