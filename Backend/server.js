const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
// Middleware
app.use(express.json());
const corsOptions = {
  origin: true,
  credentials: true,

};
app.use(cors(corsOptions));

// Import routes
const NewCustomerRoutes = require("./Routes/NewCustomerRoutes");
const customersRoutes = require("./Routes/CustomersRoutes")
const solvedRoutes = require("./Routes/solvedRoutes")
const unsolvedRoutes = require("./Routes/unsolvedRoutes")
const takenRoutes = require("./Routes/takenRoutes")
const allCustomersRoutes = require('./routes/AllCustomersRoutes');
const ServiceBudgetRoutes = require("./Routes/ServiceBudgetRoutes")
const itemProfitRoutes = require('./Routes/ItemProfitRoutes');
const itemCostRoutes = require('./Routes/ItemCostRoutes')
const userRoutes = require('./Routes/userRoutes');
const messagesRoutes = require('./Routes/messagesRouter');
const inventoryRoutes = require('./Routes/inventoryRoutes');
const expansesRoutes = require('./Routes/expensesRoutes')

app.use("/api", NewCustomerRoutes);
app.use("/api", customersRoutes)
app.use("/api", solvedRoutes)
app.use("/api", unsolvedRoutes)
app.use("/api", takenRoutes)
app.use('/api', allCustomersRoutes);
app.use("/api", ServiceBudgetRoutes)
app.use('/api', itemProfitRoutes);
app.use("/api", itemCostRoutes)
app.use('/api', userRoutes);
app.use('/api', messagesRoutes);
app.use("/api", inventoryRoutes)
app.use("/api", expansesRoutes)


// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/Future")
  .then(() => {
    console.log("Database has been connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Start the server
app.listen(3000, () => {
  console.log("Server is running successfully on port 3000");
});
