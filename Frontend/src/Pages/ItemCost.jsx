import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIClient } from "../helpers/api_helper";

import {
  itemCostPage
} from "../helpers/url_helper";


const ItemCost = () => {
  const [itemCostData, setItemCostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false); // Optional for toggling views

  // Fetch item cost data from the backend
  useEffect(() => {
    const fetchItemCostData = async () => {
      try {
        // const response = await axios.post('http://localhost:3000/api/itemCost');
        // if (response.data) {
        //   setItemCostData(response.data);
        // }
        const response = await APIClient({
                    Uri: itemCostPage,
                    Method: "POST",
                    // body: JSON.stringify({ email, password }),
                    data: {}
                });
        console.log("response", response)
        setItemCostData(response.data);
      } catch (error) {
        console.error("Error fetching item cost data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemCostData();
  }, []);

  const handleViewToggle = () => {
    setShowSummary((prev) => !prev); // Toggle the summary view
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#9D1A20]">
          {showSummary ? 'Item Summary' : 'Item Cost'}
        </h2>
        <button
          className="px-4 py-2 text-white bg-[#F68E30] rounded"
          onClick={handleViewToggle}
        >
          {showSummary ? 'View Item Cost' : 'View Item Summary'}
        </button>
      </div>

      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow mb-6">
        <thead>
          <tr className="bg-[#9D1A20] text-white">
            {showSummary ? (
              <>
                <th className="py-3 px-5 border-b text-left">Total Items</th>
                <th className="py-3 px-5 border-b text-left">Total Cost</th>
              </>
            ) : (
              <>
                <th className="py-3 px-5 border-b text-left">Customer</th>
                <th className="py-3 px-5 border-b text-left">Issue/Problem</th>
                <th className="py-3 px-5 border-b text-left">Item Cost</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {showSummary
            ? (
              <tr className="hover:bg-[#F68E30] transition duration-150">
                <td className="py-3 px-5 border-b">{itemCostData.length}</td>
                <td className="py-3 px-5 border-b">
                  ${itemCostData.reduce((acc, item) => acc + (typeof item.itemCost === 'number' && !isNaN(item.itemCost) ? item.itemCost : 0), 0).toFixed(2)}
                </td>
              </tr>
            ) : (
              itemCostData.map((entry) => (
                <tr key={entry._id} className="hover:bg-[#F68E30] transition duration-150">
                  <td className="py-3 px-5 border-b">{entry.name}</td>
                  <td className="py-3 px-5 border-b">{entry.issue}</td>
                  <td className="py-3 px-5 border-b">
                    {typeof entry.itemCost === 'number' && !isNaN(entry.itemCost) ? entry.itemCost.toFixed(2) : 'N/A'}
                  </td>
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemCost;
