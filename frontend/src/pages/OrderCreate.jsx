import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { formatPkr } from '../utils/currency';

const OrderCreate = () => {
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products/');
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products for order creation");
            }
        };
        fetchProducts();
    }, []);

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!selectedProduct) return;
        
        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        // Check if already in items, update quantity if so, else add new
        const existingItem = items.find(item => item.product_id === product.id);
        if (existingItem) {
            setItems(items.map(item => 
                item.product_id === product.id 
                    ? { ...item, quantity: item.quantity + parseInt(quantity, 10) }
                    : item
            ));
        } else {
            setItems([...items, {
                product_id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                quantity: parseInt(quantity, 10)
            }]);
        }
        
        // Reset inputs
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleRemoveItem = (productId) => {
        setItems(items.filter(item => item.product_id !== productId));
    };

    const handleSubmitOrder = async () => {
        if (items.length === 0) {
            setError("Cannot submit an empty order.");
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const payload = {
                items: items.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
            };
            const res = await api.post('/orders/', payload);
            navigate(`/orders/${res.data.id}`);
        } catch (err) {
            if (err.response?.data) {
                const errorDetail = err.response.data.non_field_errors 
                    || (Array.isArray(err.response.data) && err.response.data.map(e => e.non_field_errors || Object.values(e)).flat())
                    || err.response.data.detail 
                    || 'Failed to create order.';
                
                // If it's an array of errors from items array
                if (Array.isArray(errorDetail)) {
                     setError(errorDetail.flat().join(' '));
                } else {
                     setError(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
                }
            } else {
                setError('Failed to create order.');
            }
        } finally {
            setLoading(false);
        }
    };

    const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="container mx-auto p-4 py-8 md:p-8">
            <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-slate-100">Create Order</h1>
            
            {error && <p className="mb-6 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{error}</p>}

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Form to add item */}
                <div className="flex-1 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Add Item</h2>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Product</label>
                            <select 
                                required
                                value={selectedProduct} 
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            >
                                <option value="" disabled>Select a product...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} - {formatPkr(p.price)} (Stock: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Quantity</label>
                            <input 
                                type="number" 
                                min="1" 
                                required
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)}
                                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            />
                        </div>
                        <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
                            Add to Order
                        </button>
                    </form>
                </div>

                {/* Current Order Summary */}
                <div className="flex-1 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Current Order</h2>
                    
                    {items.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No items added yet.</p>
                    ) : (
                        <div>
                            <ul className="my-4 max-h-64 divide-y divide-slate-200 overflow-y-auto border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                                {items.map((item, idx) => (
                                    <li key={idx} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-slate-100">{item.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {item.quantity} x {formatPkr(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                                {formatPkr(item.quantity * item.price)}
                                            </span>
                                            <button 
                                                onClick={() => handleRemoveItem(item.product_id)}
                                                className="text-sm font-medium text-rose-600 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mb-4 flex items-center justify-between text-lg font-bold text-slate-900 dark:text-slate-100">
                                <span>Total:</span>
                                <span>{formatPkr(orderTotal)}</span>
                            </div>
                            <button 
                                onClick={handleSubmitOrder}
                                disabled={loading}
                                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Complete Order'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderCreate;
