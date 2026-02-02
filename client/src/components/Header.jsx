import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Home, BookOpen, LogOut, User, Sparkles } from 'lucide-react';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't show header on auth pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    return (
        <>
            {/* Sale Banner */}
            <div className="sale-banner">
                <Sparkles size={16} />
                <span>🔥 BLACK FRIDAY SALE! Use code <strong>BFSALE25</strong> for 50% OFF on all paid courses! 🔥</span>
                <Sparkles size={16} />
            </div>

            <header className="header glass">
                <div className="container header-container">
                    <Link to="/" className="logo">
                        <div className="logo-icon">
                            <GraduationCap size={28} />
                        </div>
                        <span className="logo-text">
                            Course<span className="gradient-text">Hub</span>
                        </span>
                    </Link>

                    <nav className="nav">
                        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <Link to="/my-courses" className={`nav-link ${location.pathname === '/my-courses' ? 'active' : ''}`}>
                            <BookOpen size={18} />
                            <span>My Courses</span>
                        </Link>
                    </nav>

                    {isAuthenticated && (
                        <div className="header-actions">
                            <div className="user-info">
                                <div className="user-avatar">
                                    <User size={18} />
                                </div>
                                <span className="user-name">{user?.name || 'User'}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm logout-btn">
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
