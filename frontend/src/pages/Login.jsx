import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
            navigate('/products'); // Default redirect after login
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#faf9f6] px-4 py-10 dark:bg-slate-950">
            <div className="absolute right-5 top-5"><ThemeToggle /></div>
            <div className="w-full max-w-sm space-y-6 rounded-lg border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
                <div>
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Welcome back</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Login</h2>
                </div>
                {error && <p className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        Sign In
                    </button>
                </form>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account? <Link to="/signup" className="font-medium text-indigo-700 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
