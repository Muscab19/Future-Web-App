const express = require('express');
const Message = require('../models/Messages');

const router = express.Router();

// Middleware to parse JSON
router.use(express.json());

// Get all messages
router.post('/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages.' });
    }
});

// Create a new message
router.post('/message', async (req, res) => {
    const { name, phone, message } = req.body; // Change 'names' to 'name'

    // Check if required fields are present
    if (!name || !phone || !message) { // Now correctly checks for 'name'
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = new Message({
        name, 
        phone, 
        message,
    });

    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error details:', error);
        res.status(400).json({ message: 'Error saving message.' });
    }
});



// Delete a message by ID
router.delete('/messages/:id', async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);
        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message.' });
    }
});

module.exports = router;