import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

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

    if (loading) return <div className="p-8 text-gray-500">Loading order...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!order) return <div className="p-8 text-gray-500">Order not found.</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-6">
                <Link to="/orders" className="text-blue-600 hover:underline">&larr; Back to Orders</Link>
            </div>
            
            <div className="bg-white p-6 rounded shadow mb-8">
                <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                        <p className="text-sm text-gray-500 mt-1">ID: {order.id}</p>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                        <p className="text-sm text-gray-500">Created At</p>
                        <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleString()}</p>
                        {order.created_by_name && (
                            <p className="text-sm text-gray-500 mt-1">By: {order.created_by_name}</p>
                        )}
                    </div>
                </div>

                <h2 className="text-lg font-semibold mb-4">Items</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 border-b text-sm font-medium text-gray-500">Product</th>
                                <th className="px-4 py-2 border-b text-sm font-medium text-gray-500 text-right">Price</th>
                                <th className="px-4 py-2 border-b text-sm font-medium text-gray-500 text-right">Qty</th>
                                <th className="px-4 py-2 border-b text-sm font-medium text-gray-500 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-b text-sm text-gray-900">{item.product_name}</td>
                                    <td className="px-4 py-3 border-b text-sm text-gray-900 text-right">${parseFloat(item.price_at_sale).toFixed(2)}</td>
                                    <td className="px-4 py-3 border-b text-sm text-gray-900 text-right">{item.quantity}</td>
                                    <td className="px-4 py-3 border-b text-sm font-medium text-gray-900 text-right">
                                        ${(parseFloat(item.price_at_sale) * item.quantity).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="px-4 py-4 text-right font-bold text-lg">Total Amount:</td>
                                <td className="px-4 py-4 text-right font-bold text-lg">${parseFloat(order.total_amount).toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
