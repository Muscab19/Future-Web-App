import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logos.png";
import { NavLink } from 'react-router-dom';
import { FaUser, FaClipboardList, FaSignOutAlt, FaChartBar, FaDollarSign, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [serviceBudgetTotal, setServiceBudgetTotal] = useState(0);
  const [itemProfitTotal, setItemProfitTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); // You may still keep totalRevenue for calculations
  const [totalExpenses, setTotalExpenses] = useState(0); // New state for Total Expenses
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    } else {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (!decoded.isAdmin) {
        navigate('/signin');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [serviceResponse, itemResponse, customerResponse, expenseResponse] = await Promise.all([
          axios.post('http://137.184.58.127:3000/api/serviceBudget'),
          axios.post('http://137.184.58.127:3000/api/itemProfit'),
          axios.post('http://137.184.58.127:3000/api/allCustomers'),
          axios.post('http://137.184.58.127:3000/api/expenses'), // Assuming an endpoint for expenses
        ]);

        // Calculate Service Budget Total
        const serviceBudgetTotal = serviceResponse.data.reduce(
          (total, entry) => total + (entry.serviceFee || 0), // Add service fees safely
          0
        );

        // Calculate Item Profit Total (if necessary)
        const itemProfitTotal = itemResponse.data.reduce(
          (total, entry) => total + (entry.profitAmount || 0), // Add profit amounts safely
          0
        );

        // Calculate Total Expenses
        const totalExpenses = expenseResponse.data.reduce(
          (total, entry) => total + (entry.expenseAmount || 0), // Add expense amounts safely
          0
        );

        // Set state for totals
        setServiceBudgetTotal(serviceBudgetTotal);
        setItemProfitTotal(itemProfitTotal);
        setTotalCustomers(customerResponse.data.length);
        setTotalExpenses(totalExpenses);

        // Calculate Total Revenue (if applicable)
        setTotalRevenue(serviceBudgetTotal + itemProfitTotal);
      } catch (error) {
        console.error("Error fetching totals:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  // Calculate Net Income (Revenue - Expenses)
  const netIncome = serviceBudgetTotal + itemProfitTotal - totalExpenses;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    toast.success('Logged out successfully!');
    navigate('/signin');
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 to-gray-700 text-white shadow-lg p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Company Logo" className="h-14 w-auto" />
        </div>

        <div className="flex items-center space-x-6">
          <NavLink to="/messages" className="flex items-center text-[] hover:text-orange-400">
            <FaEnvelope className="mr-2 text-lg" /> Messages
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-600 hover:bg-red-500 text-white py-1 px-4 rounded-full"
          >
            <FaSignOutAlt className="mr-2" /> Log Out
          </button>
        </div>
      </header>

      {/* Sidebar and Content */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-md p-6">
          <nav>
            <ul className="space-y-4">
              {[ 
                { href: '/newCustomer', label: 'Add Customer', icon: <FaUser /> },
                { href: '/customers', label: 'Customers', icon: <FaClipboardList /> },
                { href: '/solvedRepairs', label: 'Solved Repairs', icon: <FaClipboardList /> },
                { href: '/unsolvedRepairs', label: 'Unsolved Repairs', icon: <FaClipboardList /> },
                { href: '/takenRepairs', label: 'Taken Repairs', icon: <FaClipboardList /> },
                { href: '/itemCost', label: 'Item Cost', icon: <FaClipboardList /> },
                { href: '/inventoryPage', label: 'Inventory Page', icon: <FaClipboardList /> },
                { href: '/expensesPage', label: 'Expenses Page', icon: <FaClipboardList /> },
                { href: '/technicianPerformance', label: 'Technician Performance', icon: <FaChartBar /> },
              ].map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.href}
                    className="flex items-center text-gray-600 hover:text-orange-400 p-2 rounded-lg transition duration-200"
                  >
                    <span className="mr-3">{item.icon}</span> {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <main>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <NavLink to="/allCustomers">
                <div className="bg-white p-4 rounded-lg h-[130px] shadow-md flex items-center hover:bg-gray-50 transition duration-200">
                  <FaUser className="text-[#A51B2B] text-4xl bg-gray-400 rounded-full mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-center">All Customers</h2>
                    <p className="text-gray-700 mt-2 text-2xl text-center">{totalCustomers}</p>
                  </div>
                </div>
              </NavLink>
              <NavLink to="/serviceBudget">
                <div className="bg-white p-4 rounded-lg h-[130px] shadow-md flex items-center hover:bg-gray-50 transition duration-200">
                  <FaDollarSign className="text-[#A51B2B] text-4xl bg-gray-400 rounded-full mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-center">Service Budget</h2>
                    <p className="text-gray-700 mt-2 text-2xl text-center">${serviceBudgetTotal.toFixed(2)}</p>
                  </div>
                </div>
              </NavLink>
              <NavLink to="/itemProfit">
                <div className="bg-white p-4 rounded-lg h-[130px] shadow-md flex items-center hover:bg-gray-50 transition duration-200">
                  <FaDollarSign className="text-[#A51B2B] text-4xl bg-gray-400 rounded-full mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-center">Items Profit</h2>
                    <p className="text-gray-700 mt-2 text-2xl text-center">${itemProfitTotal.toFixed(2)}</p>
                  </div>
                </div>
              </NavLink>
              {/* Display Net Income instead of Total Revenue */}
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center hover:bg-gray-50 transition duration-200">
                <FaDollarSign className="text-[#A51B2B] text-4xl bg-gray-400 rounded-full mr-3" />
                <div>
                  <h2 className="text-xl font-bold text-center">Net Income</h2>
                  <p className="text-gray-700 mt-2 text-2xl text-center">${netIncome.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
