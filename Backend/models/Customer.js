const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  issue: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  budget:{
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  technician: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  serviceFee: { type: Number, default: 0 },
  itemCost: { type: Number, default: 0 },
  itemProfit: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Pending", "Solved", "Unsolved", "Taken"],
    default: "Pending",
  },
  paid: { 
    type: Boolean, 
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
