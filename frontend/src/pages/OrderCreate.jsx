import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Create Order</h1>
            
            {error && <p className="mb-6 p-4 text-red-600 bg-red-100 rounded">{error}</p>}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form to add item */}
                <div className="flex-1 bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Add Item</h2>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product</label>
                            <select 
                                required
                                value={selectedProduct} 
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:ring-blue-200"
                            >
                                <option value="" disabled>Select a product...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} - ${parseFloat(p.price).toFixed(2)} (Stock: {p.stock})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input 
                                type="number" 
                                min="1" 
                                required
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                            Add to Order
                        </button>
                    </form>
                </div>

                {/* Current Order Summary */}
                <div className="flex-1 bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Current Order</h2>
                    
                    {items.length === 0 ? (
                        <p className="text-gray-500 text-sm">No items added yet.</p>
                    ) : (
                        <div>
                            <ul className="divide-y border-t border-b my-4 max-h-64 overflow-y-auto">
                                {items.map((item, idx) => (
                                    <li key={idx} className="py-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.quantity} x ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-medium text-gray-900">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </span>
                                            <button 
                                                onClick={() => handleRemoveItem(item.product_id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-center text-lg font-bold mb-4">
                                <span>Total:</span>
                                <span>${orderTotal.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={handleSubmitOrder}
                                disabled={loading}
                                className="w-full px-4 py-3 text-white bg-green-600 rounded hover:bg-green-700 font-bold disabled:opacity-50"
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
