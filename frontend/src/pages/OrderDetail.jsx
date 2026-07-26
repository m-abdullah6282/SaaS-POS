import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { formatPkr } from '../utils/currency';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}/`);
                setOrder(res.data);
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to load order.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="p-8 text-slate-500 dark:text-slate-400">Loading order...</div>;
    if (error) return <div className="p-8 text-rose-700 dark:text-rose-200">{error}</div>;
    if (!order) return <div className="p-8 text-slate-500 dark:text-slate-400">Order not found.</div>;

    return (
        <div className="min-h-full bg-[#faf9f6] px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:px-8">
            <div className="container mx-auto">
                <div className="mb-6">
                    <Link to="/orders" className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">&larr; Back to Orders</Link>
                </div>
                
                <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/20">
                    <div className="mb-6 flex flex-col justify-between border-b border-slate-200 pb-4 dark:border-slate-800 md:flex-row">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Order Details</h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ID: {order.id}</p>
                        </div>
                        <div className="mt-4 text-left md:mt-0 md:text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Created At</p>
                            <p className="font-medium text-slate-800 dark:text-slate-100">{new Date(order.created_at).toLocaleString()}</p>
                            {order.created_by_name && (
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">By: {order.created_by_name}</p>
                            )}
                        </div>
                    </div>

                    <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Items</h2>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-[#faf9f6] dark:bg-slate-950/70">
                                <tr>
                                    <th className="border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">Product</th>
                                    <th className="border-b border-slate-200 px-4 py-2 text-right text-sm font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">Price</th>
                                    <th className="border-b border-slate-200 px-4 py-2 text-right text-sm font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">Qty</th>
                                    <th className="border-b border-slate-200 px-4 py-2 text-right text-sm font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item) => (
                                    <tr key={item.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                        <td className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{item.product_name}</td>
                                        <td className="border-b border-slate-100 px-4 py-3 text-right text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{formatPkr(item.price_at_sale)}</td>
                                        <td className="border-b border-slate-100 px-4 py-3 text-right text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{item.quantity}</td>
                                        <td className="border-b border-slate-100 px-4 py-3 text-right text-sm font-medium text-slate-700 dark:border-slate-800 dark:text-slate-200">
                                            {formatPkr(parseFloat(item.price_at_sale) * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="px-4 py-4 text-right text-lg font-bold text-slate-900 dark:text-slate-100">Total Amount:</td>
                                    <td className="px-4 py-4 text-right text-lg font-bold text-slate-900 dark:text-slate-100">{formatPkr(order.total_amount)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
