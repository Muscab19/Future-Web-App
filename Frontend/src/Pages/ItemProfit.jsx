import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIClient } from "../helpers/api_helper";
import { ItemProfitPage } from "../helpers/url_helper";


const ItemProfit = () => {
    const [profitData, setProfitData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch item profit data from the backend
    useEffect(() => {
        const fetchProfitData = async () => {
            try {
                // const response = await axios.get('http://localhost:3000/api/itemProfit'); 
                // if (response.data) {
                //     console.log(response.data); // Log the data to ensure it's formatted correctly
                //     setProfitData(response.data);
                // }
                const response = await APIClient({
                            Uri: ItemProfitPage,
                            Method: "POST",
                            // body: JSON.stringify({ email, password }),
                            data: {}
                        });
            console.log("response", response)
            setProfitData(response.data);
            } catch (error) {
                console.error("Error fetching profit data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfitData();
    }, []);
    

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-[#9D1A20]">Profit Margin</h2>
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-[#9D1A20] text-white">
                        <th className="py-3 px-5 border-b text-left">Customer</th>
                        <th className="py-3 px-5 border-b text-left">Issue/Problem</th>
                        <th className="py-3 px-5 border-b text-left">Profit Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {profitData.map((entry) => (
                        <tr key={entry.customer} className="hover:bg-[#F68E30] transition duration-150">
                            <td className="py-3 px-5 border-b">{entry.customer}</td>
                            <td className="py-3 px-5 border-b">{entry.issue}</td>
                            <td className="py-3 px-5 border-b">${entry.profitAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemProfit;