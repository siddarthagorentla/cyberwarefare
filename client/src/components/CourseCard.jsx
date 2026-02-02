import { Link } from 'react-router-dom';
import { Clock, User, BarChart3, Tag } from 'lucide-react';
import './CourseCard.css';

const CourseCard = ({ course, index = 0 }) => {
    const isFree = course.price === 0;

    return (
        <Link
            to={`/course/${course._id}`}
            className={`course-card card fade-in stagger-${(index % 5) + 1}`}
        >
            <div className="course-image-container">
                <img
                    src={course.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800`}
                    alt={course.title}
                    className="course-image"
                />
                <div className="course-badges">
                    {isFree ? (
                        <span className="badge badge-free">Free</span>
                    ) : (
                        <>
                            <span className="badge badge-paid">${course.price}</span>
                            <span className="badge badge-sale">50% OFF</span>
                        </>
                    )}
                </div>
                <div className="course-category">
                    <Tag size={12} />
                    {course.category || 'General'}
                </div>
            </div>

            <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">
                    {course.description?.substring(0, 120)}...
                </p>

                <div className="course-meta">
                    <div className="meta-item">
                        <User size={14} />
                        <span>{course.instructor || 'Expert'}</span>
                    </div>
                    <div className="meta-item">
                        <Clock size={14} />
                        <span>{course.duration || '4 weeks'}</span>
                    </div>
                    <div className="meta-item">
                        <BarChart3 size={14} />
                        <span>{course.level || 'Beginner'}</span>
                    </div>
                </div>

                <div className="course-footer">
                    <div className="course-price">
                        {isFree ? (
                            <span className="price price-free">FREE</span>
                        ) : (
                            <>
                                <span className="price price-paid">${(course.price * 0.5).toFixed(2)}</span>
                                <span className="price-original">${course.price}</span>
                            </>
                        )}
                    </div>
                    <span className="view-course">View Course →</span>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
