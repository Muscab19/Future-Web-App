const express = require('express');
const Item = require('../models/Customer'); 
const router = express.Router();

// Route to get all item costs
router.post('/itemCost', async (req, res) => {
  try {
    const itemCosts = await Item.find();
    
    if (itemCosts.length === 0) {
      return res.status(404).json({ message: 'No item costs found' });
    }
    
    // Optionally filter out invalid itemCost entries
    const validItemCosts = itemCosts.filter(item => typeof item.itemCost === 'number' && !isNaN(item.itemCost));

    res.status(200).json(validItemCosts);
  } catch (error) {
    console.error("Error in itemCost route:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
