import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { APIClient } from "../helpers/api_helper";

import {
  customer
} from "../helpers/url_helper";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Fetch customers data from the backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // const response = await fetch("http://localhost:3000/api/customers");
        // const data = await response.json();
        const response = await APIClient({
                    Uri: customer,
                    Method: "POST",
                    // body: JSON.stringify({ email, password }),
                    data: {
                      
                     
                  }
                });
        console.log("response", response)

        const unsolvedAndUntakenCustomers = response.data.filter(
          (customer) => customer.status !== 'Solved' && customer.status !== 'Taken'
        );
        setCustomers(unsolvedAndUntakenCustomers);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchCustomers();
  }, []);

  // Mark as Solved
  const markAsSolved = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customers/${id}/solve`, {
        method: "PUT",
      });
      if (response.ok) {
        setCustomers(customers.filter((customer) => customer._id !== id));
        toast.success("Repair marked as solved!");
      } else {
        toast.error("Failed to mark repair as solved.");
      }
    } catch (error) {
      toast.error("Error marking customer as solved.");
    }
  };

  // Mark as Unsolved
  const markAsUnsolved = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/unsolved/${id}`, {
        method: "PUT",
      });
      if (response.ok) {
        setCustomers(customers.filter((customer) => customer._id !== id));
        toast.success("Repair marked as unsolved!");
      } else {
        toast.error("Failed to mark repair as unsolved.");
      }
    } catch (error) {
      toast.error("Error marking customer as unsolved.");
    }
  };

  // Delete Customer
  const deleteCustomer = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCustomers(customers.filter((customer) => customer._id !== id));
        toast.success("Customer deleted successfully.");
      } else {
        toast.error("Failed to delete customer.");
      }
    } catch (error) {
      toast.error("Error deleting customer.");
    }
  };

  // Filter and Pagination Logic
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-[#A51B2B] mb-4">Customer Details</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or contact number..."
        className="p-2 border rounded mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-[#A51B2B] mb-2">Customer Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
          <thead>
  <tr className="border-b">
    <th className="py-2 px-4 text-left">No.</th>
    <th className="py-2 px-4 text-left">Name</th>
    <th className="py-2 px-4 text-left">Contact</th>
    <th className="py-2 px-4 text-left">Model</th>
    <th className="py-2 px-4 text-left">Time</th>
    <th className="py-2 px-4 text-left">Issue</th>
    <th className="py-2 px-4 text-left">Service Fee</th>
    <th className="py-2 px-4 text-left">Item Cost</th>
    <th className="py-2 px-4 text-left">Item Profit</th>
    <th className="py-2 px-4 text-left">Actions</th>
  </tr>
</thead>
<tbody>
  {currentCustomers.map((customer, index) => (
    <tr key={customer._id} className="border-b">
      <td className="py-2 px-4">{indexOfFirstCustomer + index + 1}</td>
      <td className="py-2 px-4">{customer.name}</td>
      <td className="py-2 px-4">{customer.contact}</td>
      <td className="py-2 px-4">{customer.model}</td>
      <td className="py-2 px-4">{customer.time}</td>
      <td className="py-2 px-4">{customer.issue}</td>
      <td className="py-2 px-4">${customer.serviceFee || '0.00'}</td>
<td className="py-2 px-4">${customer.itemCost || '0.00'}</td>
<td className="py-2 px-4">${customer.itemProfit || '0.00'}</td>
      <td className="py-2 px-4 flex space-x-2">
        {/* Action buttons */}
        <button 
          className="text-green-500 hover:text-green-700" 
          onClick={() => markAsSolved(customer._id)}
        >
          <FaCheckCircle />
        </button>
        <button 
          className="text-yellow-500 hover:text-yellow-700" 
          onClick={() => markAsUnsolved(customer._id)}
        >
          <FaExclamationCircle />
        </button>
        <button 
          className="text-red-500 hover:text-red-700" 
          onClick={() => deleteCustomer(customer._id)}
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Customers;