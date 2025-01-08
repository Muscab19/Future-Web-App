import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIClient } from "../helpers/api_helper";
import { messagesPage } from "../helpers/url_helper";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch messages from the backend
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // const response = await axios.get('http://localhost:3000/api/messages'); // Update the endpoint as necessary
                const response = await APIClient({
                        Uri: messagesPage,
                        Method: "POST",
                        data: {}
                    });
                    console.log("response", response)
                    setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();
    }, []);

    // Open modal and set the selected message
    const openModal = (message) => {
        setSelectedMessage(message);
        setModalVisible(true);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    // Close modal
    const closeModal = () => {
        setModalVisible(false);
        setSelectedMessage(null);
        document.body.style.overflow = 'auto'; // Restore background scroll
    };

    // Delete message
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/messages/${id}`);
            setMessages(messages.filter((message) => message._id !== id));
            closeModal();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-10 p-10 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-4xl font-extrabold mb-10 text-center text-slate-700">Received Messages</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className="bg-white p-5 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200"
                    >
                        <h2 className="text-2xl font-semibold text-slate-700 mb-2">{message.name}</h2>
                        <p className="text-gray-600 mb-4">{message.phone}</p>
                        <button
                            onClick={() => openModal(message)}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-400 transition duration-200 ease-in-out focus:outline-none"
                            aria-label="View message details"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for Message Details */}
            {modalVisible && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    onKeyDown={(e) => e.key === 'Escape' && closeModal()}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <h2 className="text-3xl font-bold text-slate-700 mb-4">Message Details</h2>
                        <table className="min-w-full mt-4 border-collapse">
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Name:</td>
                                    <td className="border px-4 py-2">{selectedMessage.name}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Phone:</td>
                                    <td className="border px-4 py-2">{selectedMessage.phone}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Message:</td>
                                    <td className="border px-4 py-2">{selectedMessage.message}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2 font-semibold">Date Submitted:</td>
                                    <td className="border px-4 py-2">{new Date(selectedMessage.dateSubmitted).toLocaleDateString()}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200 ease-in-out"
                                aria-label="Close details modal"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleDelete(selectedMessage._id)}
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-400 focus:outline-none transition duration-200 ease-in-out"
                                aria-label="Delete message"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
