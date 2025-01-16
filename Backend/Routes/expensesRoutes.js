// routes/expensesRoutes.js
const express = require('express');
const Expense = require('../models/expenses'); 
const router = express.Router();

// Route to get all expenses
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find(); // Get all expenses from the database
    res.json(expenses); // Send expenses as a response
  } catch (err) {
    res.status(500).send('Error retrieving expenses');
  }
});

// Route to add a new expense
router.post('/expanses', async (req, res) => {
  try {
    const { name, amount } = req.body; 
    const newExpense = new Expense({ name, amount }); 
    await newExpense.save(); 
    res.status(201).json(newExpense); 
  } catch (err) {
    res.status(500).send('Error adding expense');
  }
});

// Route to delete an expense by ID
router.delete('/expanses/:id', async (req, res) => {
  try {
    const expenseId = req.params.id; 
    await Expense.findByIdAndDelete(expenseId); 
    res.status(200).json({ message: 'Expense deleted' }); 
  } catch (err) {
    res.status(500).send('Error deleting expense');
  }
});

module.exports = router;
