import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        store_name: '',
        category: 'grocery', // default choice based on models
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState(null);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await signup(formData);
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please check the inputs.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input
                            type="text"
                            name="store_name"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-200"
                            value={formData.store_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-200"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="grocery">Grocery</option>
                            <option value="mobile_shop">Mobile Shop</option>
                            <option value="clothing">Clothing</option>
                            <option value="pharmacy">Pharmacy</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-200"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-200"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:ring focus:ring-blue-200"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="text-sm text-center">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
