import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; 

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newItemData, setNewItemData] = useState({
    name: '',
    qty: '',
    cost: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    axios.get('http://137.184.58.127:3000/api/inventory')
      .then(response => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch inventory data');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItemData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItemData.name || newItemData.qty === '' || newItemData.cost === '') {
      alert('Please provide valid Name, Quantity, and Cost.');
      return;
    }

    if (isNaN(newItemData.qty) || isNaN(newItemData.cost)) {
      alert('Quantity and Cost must be numbers.');
      return;
    }

    if (editItem) {
      axios.put(`http://localhost:3000/api/inventory/${editItem._id}`, newItemData)
        .then(response => {
          setInventory(inventory.map(item =>
            item._id === editItem._id ? response.data : item
          ));
          setEditItem(null);
          setShowForm(false);
          setNewItemData({ name: '', qty: '', cost: '' });
        })
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:3000/api/newItem', newItemData)
        .then(response => {
          console.log(response.data);
          setInventory([...inventory, response.data]);
          setShowForm(false);
          setNewItemData({ name: '', qty: '', cost: '' });

        })
        .catch(error => console.error(error));
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewItemData({
      name: item.name,
      qty: item.qty,
      cost: item.cost,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3000/api/inventory/${id}`)
      .then(() => {
        setInventory(inventory.filter(item => item._id !== id));
      })
      .catch(error => console.error(error));
  };

  const handleAddNew = () => {
    setEditItem(null);
    setNewItemData({ name: '', qty: '', cost: '' });
    setShowForm(!showForm);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Error: {error}</div>
      </div>
    );
  }  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Inventory Management</h1>

      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-3/4 px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          {showForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">QTY</th>
              <th className="px-4 py-2">Cost</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.qty}</td>
                <td className="px-4 py-3">${item.cost}</td>
                <td className="px-4 py-3 flex space-x-3">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-l-md"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-r-md"
        >
          Next
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">{editItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={newItemData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Quantity</label>
                <input
                  type="number"
                  name="qty"
                  value={newItemData.qty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Cost</label>
                <input
                  type="number"
                  name="cost"
                  value={newItemData.cost}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editItem ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
