import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
    const { user, tenant, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname.startsWith(path)
            ? 'font-medium text-indigo-700 dark:text-indigo-300'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100';
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#faf9f6] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {/* Navbar */}
            <nav className="border-b border-slate-200 bg-[#faf9f6]/95 text-slate-900 dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-100">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-base font-semibold tracking-normal">
                            {tenant ? tenant.store_name : 'POS System'}
                        </Link>
                        
                        {user && (
                            <div className="hidden gap-5 text-sm md:flex">
                                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
                                <Link to="/products" className={isActive('/products')}>Products</Link>
                                <Link to="/orders" className={isActive('/orders')}>Orders</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline-block">
                                    {user.name} ({user.role})
                                </span>
                                <ThemeToggle />
                                <button 
                                    onClick={handleLogout}
                                    className="rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <ThemeToggle />
                                <Link to="/login" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Login</Link>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Mobile Navigation */}
                {user && (
                    <div className="flex gap-4 border-t border-slate-200 px-4 py-2 text-sm dark:border-slate-800 md:hidden">
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
            <footer className="mt-auto border-t border-slate-200 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                &copy; {new Date().getFullYear()} POS System. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
