import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { formatPkr } from '../utils/currency';

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
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Orders</h1>
                <Link to="/orders/new" className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500">
                    New Order
                </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800 shadow-lg shadow-slate-950/20">
                {error && <p className="m-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-rose-200">{error}</p>}
                {loading ? (
                    <p className="p-4 text-slate-400">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="p-4 text-slate-400">No orders found.</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900/70">
                            <tr>
                                <th className="border-b border-slate-700 px-6 py-3 text-sm font-medium uppercase text-slate-400">Order ID</th>
                                <th className="border-b border-slate-700 px-6 py-3 text-sm font-medium uppercase text-slate-400">Total Amount</th>
                                <th className="border-b border-slate-700 px-6 py-3 text-sm font-medium uppercase text-slate-400">Created At</th>
                                <th className="border-b border-slate-700 px-6 py-3 text-sm font-medium uppercase text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="transition hover:bg-slate-700/40">
                                    <td className="border-b border-slate-700/70 px-6 py-4 text-sm text-slate-200">{o.id}</td>
                                    <td className="border-b border-slate-700/70 px-6 py-4 text-sm text-slate-200">{formatPkr(o.total_amount)}</td>
                                    <td className="border-b border-slate-700/70 px-6 py-4 text-sm text-slate-200">{new Date(o.created_at).toLocaleString()}</td>
                                    <td className="border-b border-slate-700/70 px-6 py-4 text-sm text-cyan-300 hover:text-cyan-200 hover:underline">
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
