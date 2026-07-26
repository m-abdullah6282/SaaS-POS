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
        return location.pathname.startsWith(path) ? "text-cyan-300 font-bold" : "text-slate-400 hover:text-white";
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-950 text-white">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-xl font-bold tracking-wider">
                            {tenant ? tenant.store_name : 'POS System'}
                        </Link>
                        
                        {user && (
                            <div className="hidden md:flex gap-5 text-sm">
                                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                                <Link to="/products" className={isActive('/products')}>Products</Link>
                                <Link to="/orders" className={isActive('/orders')}>Orders</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-slate-400 hidden sm:inline-block">
                                    {user.name} ({user.role})
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    className="px-3 py-1 bg-rose-500 hover:bg-rose-400 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-slate-400 hover:text-white">Login</Link>
                        )}
                    </div>
                </div>
                
                {/* Mobile Navigation */}
                {user && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-2 flex gap-4">
                        <Link to="/dashboard" className={`text-sm ${isActive('/dashboard')}`}>Dashboard</Link>
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
            <footer className="border-t border-slate-800 bg-slate-950 text-slate-500 text-center py-4 text-sm mt-auto">
                &copy; {new Date().getFullYear()} POS System. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
