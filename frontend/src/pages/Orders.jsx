import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/');
            setOrders(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Orders</h1>
                <Link to="/orders/new" className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                    New Order
                </Link>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                {error && <p className="p-4 text-red-600">{error}</p>}
                {loading ? (
                    <p className="p-4 text-gray-500">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="p-4 text-gray-500">No orders found.</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Total Amount</th>
                                <th className="px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Created At</th>
                                <th className="px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{o.id}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">${parseFloat(o.total_amount).toFixed(2)}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{new Date(o.created_at).toLocaleString()}</td>
                                    <td className="px-6 py-4 border-b text-sm text-blue-600 hover:underline">
                                        <Link to={`/orders/${o.id}`}>View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Orders;
