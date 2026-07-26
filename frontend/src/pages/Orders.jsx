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
        <div className="container mx-auto p-4 py-8 md:p-8">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Orders</h1>
                <Link to="/orders/new" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
                    New Order
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                {error && <p className="m-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{error}</p>}
                {loading ? (
                    <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No orders found.</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-950/70">
                            <tr>
                                <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">Order ID</th>
                                <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">Total Amount</th>
                                <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">Created At</th>
                                <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                    <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{o.id}</td>
                                    <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{formatPkr(o.total_amount)}</td>
                                    <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{new Date(o.created_at).toLocaleString()}</td>
                                    <td className="border-b border-slate-100 px-6 py-4 text-sm text-indigo-700 hover:text-indigo-600 dark:border-slate-800 dark:text-indigo-300 dark:hover:text-indigo-200">
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
