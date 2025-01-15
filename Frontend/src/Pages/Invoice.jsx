import React, { useState } from 'react';
import logo from "../assets/logos.png";


const Invoice = () => {
  const [customerData, setCustomerData] = useState({
    name: '',
    contact: '',
    model: '',
    time: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-xs mr-[300px] mx-auto my-6 bg-white w-[300px] p-4 border border-gray-300 rounded-lg shadow-md">
      <img src={logo} alt="Karaama Logo" className="h-8 mx-auto mb-2" />
      <div className="mt-8 mb-8 px-4 border-gray-300">
        {[
          { label: 'Name:', name: 'name', value: customerData.name },
          { label: 'Contact:', name: 'contact', value: customerData.contact },
          { label: 'Model:', name: 'model', value: customerData.model },
          { label: 'Time:', name: 'time', value: customerData.time },
        ].map((item, index) => (
          <div key={index} className="border-b border-gray-300 pb-1 mb-2 flex text-sm">
            <span className="font-semibold text-gray-700 w-20">{item.label}</span>
            <input
              type="text"
              name={item.name}
              value={item.value}
              onChange={handleChange}
              className="text-gray-600 flex-1 border-none outline-none"
            />
          </div>
        ))}
      </div>
      <h2 className="text-center text-white font-semibold text-lg bg-[#A51B2B] rounded-md py-1">
        Tel: +252617053989
      </h2>
    </div>
  );
};

export default Invoice;
