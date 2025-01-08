import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIClient } from "../helpers/api_helper";
import { TechnicianPerformancePage } from "../helpers/url_helper";

const TechnicianPerformance = () => {
  const [technicianData, setTechnicianData] = useState([]);
  const [commissionRates, setCommissionRates] = useState([]);
  const [budgetTypes, setBudgetTypes] = useState([]);

  // Fetch service budget data and compute technician performance
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        // const response = await axios.get('http://localhost:3000/api/serviceBudget');
        // if (response.data) {
        //   aggregateTechnicianData(response.data);
        // }
        const response = await APIClient({
                    Uri: TechnicianPerformancePage,
                    Method: "POST",
                    // body: JSON.stringify({ email, password }),
                    data: {}
                });
                console.log("response", response) 
                aggregateTechnicianData(response.data);
      } catch (error) {
        console.error("Error fetching service data:", error);
      }
    };

    fetchServiceData();
  }, []);

  // Aggregate technician performance data
  const aggregateTechnicianData = (data) => {
    const aggrData = data.reduce((acc, entry) => {
      const techName = entry.technician;
      if (!acc[techName]) {
        acc[techName] = { 
          name: techName, 
          totalRepairs: 0, 
          totalBudget: 0, 
          avgCommission: 10 // default commission percentage
        };
      }
      acc[techName].totalRepairs += 1;
      acc[techName].totalBudget += entry.serviceFee;
      return acc;
    }, {});

    const technicianArray = Object.values(aggrData);
    setTechnicianData(technicianArray);
    setCommissionRates(technicianArray.map(tech => tech.avgCommission));
    setBudgetTypes(technicianArray.map(() => 'Daily')); // Default to Yearly for all technicians
  };

  const handleCommissionChange = (index, value) => {
    const newRates = [...commissionRates];
    newRates[index] = value;
    setCommissionRates(newRates);
  };

  const handleBudgetChange = (index, value) => {
    const newBudgetTypes = [...budgetTypes];
    newBudgetTypes[index] = value;
    setBudgetTypes(newBudgetTypes);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-[#A51B2B] mb-4">Technician Performance</h1>

      {/* Technician Performance Table */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">Technician Name</th>
                <th className="py-2 px-4 text-left">Total Repairs</th>
                <th className="py-2 px-4 text-left">Total Budget</th>
                <th className="py-2 px-4 text-left">Period</th>
                <th className="py-2 px-4 text-left">Avg Commission %</th>
                <th className="py-2 px-4 text-left">Total Commission</th>
              </tr>
            </thead>
            <tbody>
              {technicianData.map((tech, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{tech.name}</td>
                  <td className="py-2 px-4">{tech.totalRepairs}</td>
                  <td className="py-2 px-4">${tech.totalBudget.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <select
                      value={budgetTypes[index]}
                      onChange={(e) => handleBudgetChange(index, e.target.value)}
                      className="border rounded-md p-1"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={commissionRates[index]}
                      onChange={(e) => handleCommissionChange(index, e.target.value)}
                      className="border rounded-md p-1"
                    >
                      {[...Array(31).keys()].slice(1).map(i => (
                        <option key={i} value={i}>
                          {i}%
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    ${(tech.totalBudget * (commissionRates[index] / 100)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TechnicianPerformance;
