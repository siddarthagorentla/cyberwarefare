import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI, subscriptionAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Clock,
    User,
    BarChart3,
    Tag,
    CheckCircle,
    Sparkles,
    ShoppingCart,
    Gift,
    Percent,
    BookOpen
} from 'lucide-react';
import './CourseDetailPage.css';

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState(null);

    // Promo state
    const [promoCode, setPromoCode] = useState('');
    const [promoValidated, setPromoValidated] = useState(false);
    const [promoLoading, setPromoLoading] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    // Subscribe state
    const [subscribeLoading, setSubscribeLoading] = useState(false);

    useEffect(() => {
        fetchCourseDetails();
        checkSubscriptionStatus();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            const response = await courseAPI.getById(id);
            setCourse(response.data.data);
        } catch (error) {
            console.error('Error fetching course:', error);
            toast.error('Course not found');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const checkSubscriptionStatus = async () => {
        try {
            const response = await subscriptionAPI.checkSubscription(id);
            setIsSubscribed(response.data.isSubscribed);
            setSubscriptionData(response.data.subscription);
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    };

    const handleValidatePromo = async () => {
        if (!promoCode.trim()) {
            toast.error('Please enter a promo code');
            return;
        }

        setPromoLoading(true);
        try {
            const response = await subscriptionAPI.validatePromo(promoCode.trim(), id);
            if (response.data.valid) {
                setPromoValidated(true);
                setDiscountedPrice(response.data.data.discountedPrice);
                setDiscountPercentage(response.data.data.discountPercentage);
                toast.success(`Promo applied! ${response.data.data.discountPercentage}% off!`);
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid promo code';
            toast.error(message);
            setPromoValidated(false);
            setDiscountedPrice(null);
        } finally {
            setPromoLoading(false);
        }
    };

    const handleSubscribe = async () => {
        if (course.price > 0 && !promoValidated) {
            toast.error('Please validate a promo code first');
            return;
        }

        setSubscribeLoading(true);
        try {
            const response = await subscriptionAPI.subscribe(
                id,
                course.price > 0 ? promoCode.trim() : null
            );
            toast.success(response.data.message);
            setIsSubscribed(true);
            setSubscriptionData(response.data.data);
        } catch (error) {
            const message = error.response?.data?.message || 'Subscription failed';
            toast.error(message);
        } finally {
            setSubscribeLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading course details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <h2>Course not found</h2>
                        <Link to="/" className="btn btn-primary">Back to Courses</Link>
                    </div>
                </div>
            </div>
        );
    }

    const isFree = course.price === 0;

    return (
        <div className="course-detail-page page">
            <div className="container">
                {/* Back Button */}
                <Link to="/" className="back-button">
                    <ArrowLeft size={20} />
                    <span>Back to Courses</span>
                </Link>

                {/* TWO COLUMN LAYOUT - Image Left, Subscription Right */}
                <div style={{
                    display: 'flex',
                    gap: '32px',
                    marginBottom: '40px',
                    flexWrap: 'wrap'
                }}>
                    {/* Left - Course Image */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div style={{
                            position: 'relative',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            aspectRatio: '16/9'
                        }}>
                            <img
                                src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                                alt={course.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {!isFree && (
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7c94b 100%)',
                                    color: '#0a0a0f',
                                    fontWeight: '700',
                                    fontSize: '0.85rem',
                                    borderRadius: '9999px'
                                }}>
                                    <Sparkles size={16} />
                                    <span>BLACK FRIDAY - 50% OFF!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Subscription Box */}
                    <div style={{
                        width: '380px',
                        flexShrink: 0,
                        padding: '28px',
                        background: '#1a1a2e',
                        border: '3px solid #ff6b35',
                        borderRadius: '16px',
                        boxShadow: '0 4px 24px rgba(255, 107, 53, 0.3)',
                        alignSelf: 'flex-start'
                    }}>
                        <h3 style={{
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            color: '#ffffff',
                            fontSize: '1.25rem',
                            fontWeight: '700'
                        }}>
                            <ShoppingCart size={24} color="#ff6b35" />
                            {isFree ? '🎁 Enroll for Free' : '🔥 Subscribe Now'}
                        </h3>

                        {isSubscribed ? (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px'
                                }}>
                                    <CheckCircle size={36} color="#10b981" />
                                </div>
                                <h4 style={{ color: '#10b981', marginBottom: '10px', fontSize: '1.25rem' }}>You're Enrolled!</h4>
                                <p style={{ color: '#a0a0b0', marginBottom: '16px', fontSize: '0.9rem' }}>You have full access.</p>
                                <Link to="/my-courses" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 20px',
                                    background: '#ffffff',
                                    color: '#0a0a0f',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem'
                                }}>
                                    <BookOpen size={16} />
                                    My Courses
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* Price Display */}
                                <div style={{
                                    marginBottom: '20px',
                                    paddingBottom: '20px',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    {isFree ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981' }}>FREE</span>
                                            <Gift size={24} color="#10b981" />
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ fontSize: '2rem', fontWeight: '900', color: '#ff6b35' }}>
                                                ${promoValidated ? discountedPrice?.toFixed(2) : (course.price * 0.5).toFixed(2)}
                                            </span>
                                            <span style={{ fontSize: '1rem', color: '#6b6b80', textDecoration: 'line-through' }}>
                                                ${course.price}
                                            </span>
                                            <span style={{
                                                padding: '4px 10px',
                                                background: 'rgba(255, 107, 53, 0.15)',
                                                color: '#ff6b35',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '700'
                                            }}>
                                                50% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Promo Code Section (for paid courses) */}
                                {!isFree && (
                                    <div style={{
                                        marginBottom: '20px',
                                        padding: '16px',
                                        background: '#12121a',
                                        borderRadius: '10px'
                                    }}>
                                        <h4 style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            color: '#f7c94b',
                                            marginBottom: '12px',
                                            fontSize: '0.9rem'
                                        }}>
                                            <Sparkles size={16} />
                                            Apply Promo Code
                                        </h4>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                placeholder="BFSALE25"
                                                value={promoCode}
                                                onChange={(e) => {
                                                    setPromoCode(e.target.value.toUpperCase());
                                                    setPromoValidated(false);
                                                }}
                                                disabled={promoValidated}
                                                style={{
                                                    flex: 1,
                                                    padding: '12px 14px',
                                                    background: '#1a1a2e',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                    color: '#ffffff',
                                                    fontSize: '0.9rem',
                                                    textTransform: 'uppercase',
                                                    fontWeight: '600',
                                                    letterSpacing: '1px'
                                                }}
                                            />
                                            <button
                                                onClick={handleValidatePromo}
                                                disabled={promoLoading || promoValidated}
                                                style={{
                                                    padding: '12px 18px',
                                                    background: promoValidated ? '#10b981' : '#ffffff',
                                                    color: promoValidated ? '#ffffff' : '#0a0a0f',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontWeight: '600',
                                                    cursor: promoLoading || promoValidated ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {promoLoading ? '...' : promoValidated ? (
                                                    <>
                                                        <CheckCircle size={14} />
                                                        OK
                                                    </>
                                                ) : 'Apply'}
                                            </button>
                                        </div>
                                        {promoValidated && (
                                            <p style={{ marginTop: '10px', color: '#10b981', fontSize: '0.8rem' }}>
                                                ✓ You save ${(course.price * discountPercentage / 100).toFixed(2)}
                                            </p>
                                        )}
                                        <p style={{ marginTop: '8px', fontSize: '0.75rem', color: '#6b6b80' }}>
                                            Use <strong style={{ color: '#ff6b35' }}>BFSALE25</strong> for 50% off
                                        </p>
                                    </div>
                                )}

                                {/* Subscribe Button */}
                                <button
                                    onClick={handleSubscribe}
                                    disabled={subscribeLoading || (!isFree && !promoValidated)}
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        background: subscribeLoading || (!isFree && !promoValidated) ? '#555555' : '#ffffff',
                                        color: subscribeLoading || (!isFree && !promoValidated) ? '#888888' : '#0a0a0f',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        cursor: subscribeLoading || (!isFree && !promoValidated) ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        marginBottom: '14px'
                                    }}
                                >
                                    {subscribeLoading ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <ShoppingCart size={20} />
                                            {isFree ? 'Subscribe for Free' : 'Subscribe Now'}
                                        </>
                                    )}
                                </button>

                                {!isFree && !promoValidated && (
                                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6b6b80' }}>
                                        Apply promo code to subscribe
                                    </p>
                                )}

                                {/* Features */}
                                <div style={{
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b0', fontSize: '0.85rem' }}>
                                        <CheckCircle size={14} color="#10b981" />
                                        <span>Instant Access</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b0', fontSize: '0.85rem' }}>
                                        <CheckCircle size={14} color="#10b981" />
                                        <span>Lifetime Access</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a0a0b0', fontSize: '0.85rem' }}>
                                        <CheckCircle size={14} color="#10b981" />
                                        <span>Certificate Included</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Course Header */}
                <div className="course-header">
                    <div className="course-badges-detail">
                        <span className="badge badge-category">
                            <Tag size={12} />
                            {course.category || 'General'}
                        </span>
                        <span className={`badge ${isFree ? 'badge-free' : 'badge-paid'}`}>
                            {isFree ? 'Free Course' : 'Premium'}
                        </span>
                    </div>

                    <h1 className="course-title-detail">{course.title}</h1>

                    <div className="course-meta-detail">
                        <div className="meta-item-detail">
                            <User size={18} />
                            <span>{course.instructor || 'Expert Instructor'}</span>
                        </div>
                        <div className="meta-item-detail">
                            <Clock size={18} />
                            <span>{course.duration || '4 weeks'}</span>
                        </div>
                        <div className="meta-item-detail">
                            <BarChart3 size={18} />
                            <span>{course.level || 'Beginner'}</span>
                        </div>
                    </div>
                </div>

                {/* Course Description */}
                <div className="course-description-section">
                    <h2>About This Course</h2>
                    <p>{course.description}</p>
                </div>

                {/* What You'll Learn */}
                <div className="course-features">
                    <h2>What You'll Learn</h2>
                    <ul className="feature-list">
                        <li><CheckCircle size={18} /> Comprehensive curriculum designed by experts</li>
                        <li><CheckCircle size={18} /> Hands-on projects and real-world examples</li>
                        <li><CheckCircle size={18} /> Lifetime access to course materials</li>
                        <li><CheckCircle size={18} /> Certificate of completion</li>
                        <li><CheckCircle size={18} /> Community support and Q&A</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
