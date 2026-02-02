import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { subscriptionAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
    BookOpen,
    Calendar,
    DollarSign,
    Percent,
    ExternalLink,
    GraduationCap,
    ShoppingCart
} from 'lucide-react';
import './MyCoursesPage.css';

const MyCoursesPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const response = await subscriptionAPI.getMyCourses();
            setSubscriptions(response.data.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            toast.error('Failed to load your courses');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateTotalSaved = () => {
        return subscriptions.reduce((total, sub) => {
            return total + (sub.originalPrice - sub.pricePaid);
        }, 0);
    };

    const calculateTotalPaid = () => {
        return subscriptions.reduce((total, sub) => total + sub.pricePaid, 0);
    };

    return (
        <div className="my-courses-page page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <div className="header-content">
                        <h1 className="page-title">
                            <BookOpen className="title-icon" size={32} />
                            My Courses
                        </h1>
                        <p className="page-subtitle">
                            Track your enrolled courses and learning progress
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading your courses...</p>
                    </div>
                ) : subscriptions.length > 0 ? (
                    <>
                        {/* Stats Cards */}
                        <div className="stats-row">
                            <div className="stat-card-mini">
                                <GraduationCap size={24} />
                                <div>
                                    <span className="stat-number">{subscriptions.length}</span>
                                    <span className="stat-text">Courses Enrolled</span>
                                </div>
                            </div>
                            <div className="stat-card-mini">
                                <DollarSign size={24} />
                                <div>
                                    <span className="stat-number">${calculateTotalPaid().toFixed(2)}</span>
                                    <span className="stat-text">Total Invested</span>
                                </div>
                            </div>
                            <div className="stat-card-mini savings">
                                <Percent size={24} />
                                <div>
                                    <span className="stat-number">${calculateTotalSaved().toFixed(2)}</span>
                                    <span className="stat-text">Total Saved</span>
                                </div>
                            </div>
                        </div>

                        {/* Courses List */}
                        <div className="subscriptions-list">
                            {subscriptions.map((subscription, index) => (
                                <div
                                    key={subscription.subscriptionId}
                                    className={`subscription-card card fade-in stagger-${(index % 5) + 1}`}
                                >
                                    <div className="subscription-image">
                                        <img
                                            src={subscription.course?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                                            alt={subscription.course?.title}
                                        />
                                    </div>

                                    <div className="subscription-content">
                                        <div className="subscription-header">
                                            <h3 className="subscription-title">{subscription.course?.title}</h3>
                                            <div className="subscription-badges">
                                                {subscription.pricePaid === 0 ? (
                                                    <span className="badge badge-free">Free</span>
                                                ) : (
                                                    <span className="badge badge-paid">Premium</span>
                                                )}
                                                {subscription.discountApplied > 0 && (
                                                    <span className="badge badge-sale">
                                                        {subscription.discountApplied}% Saved
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="subscription-description">
                                            {subscription.course?.description?.substring(0, 150)}...
                                        </p>

                                        <div className="subscription-details">
                                            <div className="detail-item">
                                                <Calendar size={16} />
                                                <span>Enrolled: {formatDate(subscription.subscribedAt)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <DollarSign size={16} />
                                                <span>
                                                    Price Paid: {subscription.pricePaid === 0 ? 'FREE' : `$${subscription.pricePaid.toFixed(2)}`}
                                                </span>
                                            </div>
                                            {subscription.discountApplied > 0 && (
                                                <div className="detail-item savings">
                                                    <Percent size={16} />
                                                    <span>
                                                        Saved: ${(subscription.originalPrice - subscription.pricePaid).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            to={`/course/${subscription.course?._id}`}
                                            className="btn btn-secondary view-course-btn"
                                        >
                                            <ExternalLink size={16} />
                                            View Course
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="empty-state-container">
                        <div className="empty-illustration">
                            <ShoppingCart size={80} />
                        </div>
                        <h2>No Courses Yet</h2>
                        <p>You haven't subscribed to any courses yet. Start exploring our amazing collection!</p>
                        <Link to="/" className="btn btn-primary btn-lg">
                            <GraduationCap size={20} />
                            Explore Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCoursesPage;
