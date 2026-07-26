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
        <div className="min-h-full bg-[#faf9f6] px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-8">
            <div className="container mx-auto">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold tracking-normal text-slate-900 dark:text-slate-100">Orders</h1>
                    <Link to="/orders/new" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        New Order
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/20">
                    {error && <p className="m-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{error}</p>}
                    {loading ? (
                        <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading orders...</p>
                    ) : orders.length === 0 ? (
                        <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No orders found.</p>
                    ) : (
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-[#faf9f6] dark:bg-slate-950/70">
                                <tr>
                                    <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">Order ID</th>
                                    <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">Total Amount</th>
                                    <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">Created At</th>
                                    <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                        <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{o.id}</td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{formatPkr(o.total_amount)}</td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{new Date(o.created_at).toLocaleString()}</td>
                                        <td className="border-b border-slate-100 px-6 py-4 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:border-slate-800 dark:text-indigo-300 dark:hover:text-indigo-200">
                                            <Link to={`/orders/${o.id}`}>View</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
