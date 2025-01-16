import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaPlusCircle, FaDollarSign } from 'react-icons/fa';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });

  // Fetch expenses on initial load
  useEffect(() => {
    axios.get('http://localhost:3000/api/expenses')
      .then((response) => {
        setExpenses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching expenses:', error);
      });
  }, []);

  // Add new expense
  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount) {
      axios
        .post('http://localhost:3000/api/expanses', newExpense)
        .then((response) => {
          setExpenses([...expenses, response.data]);
          setNewExpense({ name: '', amount: '' });
        })
        .catch((error) => {
          console.error('Error adding expense:', error);
        });
    }
  };

  // Delete an expense
  const handleDeleteExpense = (id) => {
    axios.delete(`http://localhost:3000/api/expanses/${id}`)
      .then(() => {
        const updatedExpenses = expenses.filter((expense) => expense._id !== id);
        setExpenses(updatedExpenses);
      })
      .catch((error) => {
        console.error('Error deleting expense:', error);
      });
  };

  // Calculate total expense
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#A51B2B]">Expenses Tracker</h1>

      <div className="flex gap-8">
        {/* Expenses Table */}
        <div className="flex-1 bg-white shadow-xl rounded-lg p-6">
          <table className="w-full table-auto mb-8">
            <thead className="border-b">
              <tr>
                <th className="py-3 px-6 text-left text-[#9C1A20]">Expense</th>
                <th className="py-3 px-6 text-left text-[#9C1A20]">Amount</th>
                <th className="py-3 px-6 text-left text-[#9C1A20]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">{expense.name}</td>
                  <td className="py-3 px-6">${expense.amount.toFixed(2)}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex gap-6 items-center">
            <input
              type="text"
              placeholder="Expense Name"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#A51B2B]"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#A51B2B]"
            />
            <button
              onClick={handleAddExpense}
              className="bg-[#CD7B3F] text-white p-3 rounded-md hover:bg-[#9C1A20] focus:outline-none"
            >
              <FaPlusCircle className="inline mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Total Expense Box */}
        <div className="w-1/3 bg-gradient-to-br from-[#CD7B3F] to-[#9C1A20] p-8 rounded-xl shadow-2xl flex flex-col items-center justify-center">
          <FaDollarSign className="text-white text-5xl mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-4">Total Expense</h2>
          <div className="bg-white p-6 rounded-xl shadow-lg w-full flex justify-center">
            <p className="text-4xl font-bold text-[#A51B2B]">${totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesPage;
