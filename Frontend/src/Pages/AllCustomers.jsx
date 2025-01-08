import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { APIClient } from "../helpers/api_helper";
import { AllCustomersPage } from "../helpers/url_helper";

const AllCustomers = () => {
  // const [allCustomers, setallCustomers] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Fetch customer data from API when component mounts
  // useEffect(() => {
    // axios.get('http://localhost:3000/api/allCustomers') 
    //   .then(response => setCustomerData(response.data))
    //   .catch(error => console.error("Error fetching customers:", error));
    
  // }, []);

  useEffect(() => {
      const fetchAllCustomers = async () => {
        try {
          const response = await APIClient({
              Uri: AllCustomersPage,
              Method: "POST",
              data: {}
          });
          console.log("response", response) // Inspect the API response
          setCustomerData(response.data);
        } catch (error) {
          console.error("Error fetching all customers:", error);
        }
      };
      fetchAllCustomers();
    }, []);  

  // Mark a customer as "Solved"
  const markAsSolved = (customerIndex, customerId) => {
    axios.patch(`http://localhost:3000/api/allCustomers/${customerId}`, { status: 'Solved' })
      .then(() => {
        const updatedCustomers = [...customerData];
        updatedCustomers[customerIndex].status = 'Solved';
        setCustomerData(updatedCustomers);
      })
      .catch(error => console.error("Error updating status:", error));
  };

  // Delete a customer
  const deleteCustomer = (customerIndex, customerId) => {
    axios.delete(`http://localhost:3000/api/customers/${customerId}`)
      .then(() => {
        const updatedCustomers = customerData.filter((_, index) => index !== customerIndex);
        setCustomerData(updatedCustomers);
      })
      .catch(error => console.error("Error deleting customer:", error));
  };

  // Filter customers based on the search term and selected status
  const filteredCustomers = customerData.filter(customer => {
    const matchesSearchTerm = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || customer.status === selectedStatus;

    return matchesSearchTerm && matchesStatus;
  });

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-[#A51B2B] mb-6">All Customers</h1>

      {/* Search Bar and Status Filter */}
      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by name or contact number..."
          className="p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Taken">Taken</option>
          <option value="Solved">Solved</option>
          <option value="Pending">Pending</option>
          <option value="Unsolved">Unsolved</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-4 px-3 text-left text-lg">No.</th>
                <th className="py-4 px-3 text-left text-lg">Name</th>
                <th className="py-4 px-3 text-left text-lg">Contact</th>
                <th className="py-4 px-3 text-left text-lg">Model</th>
                <th className="py-4 px-3 text-left text-lg">Issue</th>
                <th className="py-4 px-3 text-left text-lg">Status</th>
                <th className="py-4 px-3 text-left text-lg">Technician</th>
                <th className="py-4 px-3 text-left text-lg">Budget</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer, index) => (
                  <tr key={customer.id} className="border-b">
                    <td className="py-2 px-2 text-base">{indexOfFirstCustomer + index + 1}</td>
                    <td className="py-2 px-2 text-base">{customer.name}</td>
                    <td className="py-2 px-2 text-base">{customer.contact}</td>
                    <td className="py-2 px-2 text-base">{customer.model}</td>
                    <td className="py-2 px-2 text-base">{customer.issue}</td>
                    <td className="py-2 px-2 text-base">{customer.status}</td>
                    <td className="py-2 px-2 text-base">{customer.technician}</td>
                    <td className="py-2 px-10 text-base">${customer.budget}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-2 px-4 text-center">No customers found.</td>
                </tr>
              )}
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

export default AllCustomers;
