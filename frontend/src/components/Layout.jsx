import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, tenant, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path) ? "text-white font-bold" : "text-gray-300 hover:text-white";
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white shadow-md">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-xl font-bold tracking-wider">
                            {tenant ? tenant.store_name : 'POS System'}
                        </Link>
                        
                        {user && (
                            <div className="hidden md:flex gap-4">
                                <Link to="/products" className={isActive('/products')}>Products</Link>
                                <Link to="/orders" className={isActive('/orders')}>Orders</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-300 hidden sm:inline-block">
                                    {user.name} ({user.role})
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                        )}
                    </div>
                </div>
                
                {/* Mobile Navigation */}
                {user && (
                    <div className="md:hidden bg-gray-700 px-4 py-2 flex gap-4">
                        <Link to="/products" className={`text-sm ${isActive('/products')}`}>Products</Link>
                        <Link to="/orders" className={`text-sm ${isActive('/orders')}`}>Orders</Link>
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="flex-1">
                <Outlet />
            </main>
            
            {/* Footer */}
            <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm mt-auto">
                &copy; {new Date().getFullYear()} POS System. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
