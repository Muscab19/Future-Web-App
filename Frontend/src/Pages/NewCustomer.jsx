import React, { useState, useEffect } from 'react';
import logo from "../assets/logos.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { APIClient } from "../helpers/api_helper";

import {
  NewCustomerApi
} from "../helpers/url_helper";

const NewCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: '',
    contact: '',
    model: '',
    issue: '',
    item: '', // This will store the selected item
    budget: '',
    time: '',
    technician: '',
    description: '',
    serviceFee: '', // Manual input for Service Fee
    itemCost: '', // Item Cost (auto-filled)
    itemProfit: '', // Item Profit (auto-filled)
  });

  const [inventoryItems, setInventoryItems] = useState([]); // Inventory items

  // Fetch Inventory Items on Component Mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://137.184.58.127:3000/api/inventory"); 
        const data = await response.json();
        setInventoryItems(data);
        console.log("response", response)
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        toast.error("Failed to fetch inventory data. Please try again.");
      }
    };

    fetchInventory();
  }, []);

  // Update State on Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update State When Item Is Selected
  const handleItemChange = (e) => {
    const selectedItemName = e.target.value;
    const item = inventoryItems.find((item) => item.name === selectedItemName);

    if (item) {
      setCustomerData((prevData) => ({
        ...prevData,
        item: selectedItemName,
        itemCost: item.cost, // Auto-fill Item Cost
        itemProfit: prevData.budget
          ? prevData.budget - item.cost // Calculate Item Profit dynamically
          : '',
      }));
    } else {
      setCustomerData((prevData) => ({
        ...prevData,
        item: '',
        itemCost: '',
        itemProfit: '',
      }));
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Add new customer data to the database
      // const response = await fetch('http://localhost:3000/api/new-customer', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(customerData),
      // });

      const response = await APIClient({
                  Uri: NewCustomerApi,
                  Method: "POST",
                  // body: JSON.stringify({ email, password }),
                  data: customerData
              });
              console.log("response", response)

      if (!response.data.success) {
        // If the response is not okay, throw an error
        throw new Error(response.data.error || 'Failed to add customer');
      }
  
      toast.success(response.data.message);
  
      // If an item is selected, decrease the quantity by 1
      if (customerData.item) {
        try {
          // Decrease item quantity by 1
          await axios.put(`http://localhost:3000/api/inventory/decrease/${customerData.item}`);
          toast.success('Item quantity decreased by 1');
        } catch (error) {
          console.error('Error updating inventory:', error);
          toast.error('Failed to update inventory quantity');
        }
      }      
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error(error.message || 'Error adding customer');
    }
  };  

    const handleBudgetChange = (newBudget) => {
        setCustomerData((prevData) => ({
            ...prevData,
            budget: newBudget,
        }));
    };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg ml-[200px] shadow-md w-full max-w-sm">
        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="Company Logo" className="h-12 w-auto mb-2" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {[ 
            { label: "Name", name: "name", type: "text" },
            { label: "Contact", name: "contact", type: "text" },
            { label: "Model", name: "model", type: "text" },
            { label: "Issue", name: "issue", type: "text" },
            { label: "Budget", name: "budget", type: "number" },
            { label: "Service Fee", name: "serviceFee", type: "number" }, // Manual Service Fee input
            { label: "Time", name: "time", type: "text" },
          ].map((field, index) => (
            <div key={index} className="flex items-center">
              <label className="w-1/3 text-xs font-medium text-gray-700 mr-2">{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={customerData[field.name]}
                onChange={handleChange}
                className="flex-1 p-1 border border-gray-300 rounded text-xs"
                required
              />
            </div>
          ))}

          {/* Technician Field */}
          <div className="flex items-center">
            <label className="w-1/3 text-xs font-medium text-gray-700 mr-2">Technician:</label>
            <select
              name="technician"
              value={customerData.technician}
              onChange={handleChange}
              className="flex-1 p-1 border border-gray-300 rounded text-xs"
              required
            >
              <option value="">Select Technician</option>
              <option value="Mohamed">Mohamed</option>
              <option value="Hussain">Hussain</option>
            </select>
          </div>

          {/* Inventory Item */}
          <div className="flex items-center">
            <label className="w-1/3 text-xs font-medium text-gray-700 mr-2">Item:</label>
            <select
              name="item"
              value={customerData.item}
              onChange={handleItemChange}
              className="flex-1 p-1 border border-gray-300 rounded text-xs"
              required
            >
              <option value="">Select Item</option>
              {inventoryItems.map((item, index) => (
                <option key={index} value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#A51B2B] text-white px-3 py-1 rounded hover:bg-[#911D2D] transition-colors text-sm"
          >
            Submit
          </button>
        </form>
      </div>

      {/* <div className="max-w-xs mr-[300px] mx-auto my-6 bg-white w-[300px] p-4 border border-gray-300 rounded-lg shadow-md">
    <img src={logo} alt="Karaama Logo" className="h-8 mx-auto mb-2" />
    <div className="mt-8 mb-8 px-4 border-gray-300">
        {[
            { label: "Name:", value: customerData.name },
            { label: "Contact:", value: customerData.contact },
            { label: "Model:", value: customerData.model },
            { label: "Time:", value: customerData.time },
        ].map((item, index) => (
            <div key={index} className="border-b border-gray-300 pb-1 mb-2 flex text-sm">
                <span className="font-semibold text-gray-700 w-20">{item.label}</span>
                <span className="text-gray-600 flex-1">{item.value}</span>
            </div>
        ))}
        <div className="border-b border-gray-300 pb-1 mb-2 flex text-sm">
            <label htmlFor="budget" className="font-semibold text-gray-700 w-20">
                Budget:
            </label>
            <input
                id="budget"
                type="text"
                className="text-gray-600  rounded-md px-2 py-1 flex-1"
            />
        </div>
    </div>
    <h2 className="text-center text-white font-semibold text-lg bg-[#A51B2B] rounded-md py-1">
        Tel: +252617053989
    </h2>
</div> */}



      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default NewCustomer;
