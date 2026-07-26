import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { formatPkr } from '../utils/currency';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        cost_price: '',
        stock: ''
    });
    const [formError, setFormError] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products/');
            setProducts(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await api.post('/products/', {
                ...formData,
                price: parseFloat(formData.price),
                cost_price: parseFloat(formData.cost_price || 0),
                stock: parseInt(formData.stock || 0, 10)
            });
            // Clear form and refresh list
            setFormData({ name: '', price: '', cost_price: '', stock: '' });
            fetchProducts();
        } catch (err) {
            // Handle validation errors from backend
            if (err.response?.data) {
                const errors = Object.values(err.response.data).flat().join(' ');
                setFormError(errors || 'Failed to add product.');
            } else {
                setFormError('Failed to add product.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4 py-8 md:p-8">
            <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-slate-100">Products</h1>

            {/* Add Product Form */}
            <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Add New Product</h2>
                {formError && <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{formError}</p>}
                
                <form onSubmit={handleAddProduct} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleFormChange}
                               className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Price (PKR)</label>
                        <input type="number" step="0.01" min="0" name="price" required value={formData.price} onChange={handleFormChange}
                               className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Cost Price (PKR)</label>
                        <input type="number" step="0.01" min="0" name="cost_price" value={formData.cost_price} onChange={handleFormChange}
                               className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Stock</label>
                        <input type="number" min="0" name="stock" value={formData.stock} onChange={handleFormChange}
                               className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    </div>
                    <button type="submit" className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 md:w-auto">
                        Add
                    </button>
                </form>
            </div>

            {/* Product List */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                {error && <p className="m-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{error}</p>}
                {loading ? (
                    <p className="p-5 text-sm text-slate-500 dark:text-slate-400">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500 dark:text-slate-400">No active products found.</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-950/70">
                            <tr>
                                <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">Name</th>
                                <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">Price</th>
                                <th className="border-b border-slate-200 px-6 py-3 text-sm font-medium uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                                    <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{p.name}</td>
                                    <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{formatPkr(p.price)}</td>
                                    <td className="border-b border-slate-100 px-6 py-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">{p.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Products;
