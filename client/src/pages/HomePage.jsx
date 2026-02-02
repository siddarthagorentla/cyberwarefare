import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api';
import CourseCard from '../components/CourseCard';
import toast from 'react-hot-toast';
import { Search, Sparkles, GraduationCap, Users, Award, TrendingUp } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, free, paid

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await courseAPI.getAll();
            setCourses(response.data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'free') return matchesSearch && course.price === 0;
        if (filter === 'paid') return matchesSearch && course.price > 0;
        return matchesSearch;
    });

    const stats = {
        totalCourses: courses.length,
        freeCourses: courses.filter(c => c.price === 0).length,
        paidCourses: courses.filter(c => c.price > 0).length,
    };

    return (
        <div className="home-page page">
            <div className="container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Sparkles size={14} />
                            <span>BLACK FRIDAY MEGA SALE</span>
                        </div>
                        <h1 className="hero-title">
                            Unlock Your Potential with <span className="gradient-text">Premium Courses</span>
                        </h1>
                        <p className="hero-subtitle">
                            Get 50% OFF on all paid courses with code <strong>BFSALE25</strong>.
                            Start learning from industry experts today!
                        </p>

                        {/* Search Bar */}
                        <div className="search-container">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search courses by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <GraduationCap size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.totalCourses}+</span>
                                <span className="stat-label">Courses</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Users size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">10K+</span>
                                <span className="stat-label">Students</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <Award size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">50%</span>
                                <span className="stat-label">Discount</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">4.9★</span>
                                <span className="stat-label">Rating</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section className="courses-section">
                    <div className="section-header">
                        <h2 className="section-title">Explore Courses</h2>
                        <div className="filter-tabs">
                            <button
                                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All ({courses.length})
                            </button>
                            <button
                                className={`filter-tab ${filter === 'free' ? 'active' : ''}`}
                                onClick={() => setFilter('free')}
                            >
                                Free ({stats.freeCourses})
                            </button>
                            <button
                                className={`filter-tab ${filter === 'paid' ? 'active' : ''}`}
                                onClick={() => setFilter('paid')}
                            >
                                Paid ({stats.paidCourses})
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading courses...</p>
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="courses-grid">
                            {filteredCourses.map((course, index) => (
                                <CourseCard key={course._id} course={course} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📚</div>
                            <h3>No courses found</h3>
                            <p>Try adjusting your search or filter</p>
                        </div>
                    )}
                </section>

                {/* Promo Section */}
                <section className="promo-section glass">
                    <div className="promo-content">
                        <h2>🎉 Limited Time Offer!</h2>
                        <p>Use promo code <span className="promo-code">BFSALE25</span> to get 50% off on all paid courses.</p>
                        <p className="promo-expires">Hurry! Offer ends soon.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
