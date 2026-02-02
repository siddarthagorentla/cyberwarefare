import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, GraduationCap, Sparkles, Eye, EyeOff } from 'lucide-react';
import './AuthPages.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate(from, { replace: true });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back! 🎉');
            navigate(from, { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background">
                <div className="bg-gradient-1"></div>
                <div className="bg-gradient-2"></div>
                <div className="bg-gradient-3"></div>
            </div>

            <div className="auth-container">
                <div className="auth-card glass">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <div className="auth-logo-icon">
                                <GraduationCap size={32} />
                            </div>
                            <span className="auth-logo-text">
                                Course<span className="gradient-text">Hub</span>
                            </span>
                        </Link>

                        <div className="sale-tag">
                            <Sparkles size={14} />
                            <span>BLACK FRIDAY SALE</span>
                        </div>

                        <h1 className="auth-title">Welcome Back!</h1>
                        <p className="auth-subtitle">Sign in to access your courses and exclusive deals</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
                    </div>

                    <div className="demo-credentials">
                        <h4>Demo Credentials</h4>
                        <div className="credential-list">
                            <div className="credential-item" onClick={() => { setEmail('john@example.com'); setPassword('password123'); }}>
                                <span>john@example.com</span>
                                <span>password123</span>
                            </div>
                            <div className="credential-item" onClick={() => { setEmail('jane@example.com'); setPassword('password123'); }}>
                                <span>jane@example.com</span>
                                <span>password123</span>
                            </div>
                            <div className="credential-item" onClick={() => { setEmail('demo@example.com'); setPassword('demo123'); }}>
                                <span>demo@example.com</span>
                                <span>demo123</span>
                            </div>
                        </div>
                        <p className="credential-hint">Click to auto-fill</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
