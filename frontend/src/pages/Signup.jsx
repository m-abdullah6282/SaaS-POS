import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

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
        <div className="relative flex min-h-screen items-center justify-center bg-[#faf9f6] px-4 py-10 dark:bg-slate-950">
            <div className="absolute right-5 top-5"><ThemeToggle /></div>
            <div className="w-full max-w-sm space-y-6 rounded-lg border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
                <div>
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Create your workspace</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Sign up</h2>
                </div>
                {error && <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Store Name</label>
                        <input
                            type="text"
                            name="store_name"
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            value={formData.store_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Category</label>
                        <select
                            name="category"
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Already have an account? <Link to="/login" className="font-medium text-indigo-700 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
