import React, { useState, useEffect } from 'react';
import api from '../api/axios';

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
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Products</h1>

            {/* Add Product Form */}
            <div className="bg-white p-6 rounded shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                {formError && <p className="text-sm text-red-600 bg-red-100 p-2 rounded mb-4">{formError}</p>}
                
                <form onSubmit={handleAddProduct} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleFormChange}
                               className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:ring-blue-200" />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" step="0.01" min="0" name="price" required value={formData.price} onChange={handleFormChange}
                               className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:ring-blue-200" />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-gray-700">Cost Price</label>
                        <input type="number" step="0.01" min="0" name="cost_price" value={formData.cost_price} onChange={handleFormChange}
                               className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:ring-blue-200" />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" min="0" name="stock" value={formData.stock} onChange={handleFormChange}
                               className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:ring-blue-200" />
                    </div>
                    <button type="submit" className="w-full md:w-auto px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">
                        Add
                    </button>
                </form>
            </div>

            {/* Product List */}
            <div className="bg-white rounded shadow overflow-hidden">
                {error && <p className="p-4 text-red-600">{error}</p>}
                {loading ? (
                    <p className="p-4 text-gray-500">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="p-4 text-gray-500">No active products found.</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 border-b text-sm font-medium text-gray-500 uppercase">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{p.name}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">${parseFloat(p.price).toFixed(2)}</td>
                                    <td className="px-6 py-4 border-b text-sm text-gray-900">{p.stock}</td>
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
