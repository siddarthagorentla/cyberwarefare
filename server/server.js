require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const subscriptionRoutes = require('./routes/subscriptions');

// Seed data
const seedData = async () => {
    try {
        // Check if data already exists
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Database already seeded');
            return;
        }

        console.log('Seeding database...');

        // Create users
        const users = [
            { name: 'John Doe', email: 'john@example.com', password: 'password123' },
            { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
            { name: 'Demo User', email: 'demo@example.com', password: 'demo123' }
        ];

        await User.create(users);
        console.log('✅ Created 3 users');

        // Create courses
        const courses = [
            {
                title: 'Introduction to Web Development',
                description: 'Master the fundamentals of web development in this comprehensive course. Learn HTML5, CSS3, and JavaScript from scratch. Build responsive websites and understand how the web works. Perfect for absolute beginners who want to start their coding journey. Includes hands-on projects and real-world examples.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
                category: 'Web Development',
                instructor: 'Sarah Johnson',
                duration: '6 weeks',
                level: 'Beginner'
            },
            {
                title: 'Advanced React & Redux Masterclass',
                description: 'Take your React skills to the next level! Deep dive into React hooks, context API, Redux toolkit, and advanced patterns. Learn to build scalable applications with proper state management. Cover testing with Jest and React Testing Library. Build a complete e-commerce application as the final project.',
                price: 99.99,
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
                category: 'Frontend',
                instructor: 'Michael Chen',
                duration: '8 weeks',
                level: 'Advanced'
            },
            {
                title: 'Node.js Backend Development',
                description: 'Build powerful backend applications with Node.js and Express. Learn REST API design, authentication with JWT, database integration with MongoDB and PostgreSQL. Cover security best practices, testing, and deployment strategies. Create a full-featured API by the end of the course.',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
                category: 'Backend',
                instructor: 'David Wilson',
                duration: '7 weeks',
                level: 'Intermediate'
            },
            {
                title: 'Python for Data Science',
                description: 'Start your data science journey with Python! Learn pandas, NumPy, matplotlib, and scikit-learn. Understand data cleaning, visualization, and basic machine learning concepts. Work with real datasets and complete hands-on projects. No prior programming experience required.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
                category: 'Data Science',
                instructor: 'Emily Brown',
                duration: '10 weeks',
                level: 'Beginner'
            },
            {
                title: 'Full Stack MERN Development',
                description: 'Become a full-stack developer with the MERN stack (MongoDB, Express, React, Node.js). Build complete web applications from frontend to backend. Learn deployment on cloud platforms, CI/CD pipelines, and DevOps basics. Includes three major projects and career guidance.',
                price: 149.99,
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
                category: 'Full Stack',
                instructor: 'Alex Turner',
                duration: '12 weeks',
                level: 'Intermediate'
            },
            {
                title: 'UI/UX Design Fundamentals',
                description: 'Learn the principles of great user interface and user experience design. Master Figma, understand color theory, typography, and layout. Study user research methods and usability testing. Create a complete portfolio-ready project. Great for developers who want to improve their design skills.',
                price: 59.99,
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
                category: 'Design',
                instructor: 'Lisa Anderson',
                duration: '5 weeks',
                level: 'Beginner'
            },
            {
                title: 'Docker & Kubernetes Essentials',
                description: 'Master containerization and orchestration. Learn Docker fundamentals, create Dockerfiles, work with Docker Compose. Understand Kubernetes architecture, deployments, services, and scaling. Deploy applications to cloud Kubernetes clusters. Essential for modern DevOps practices.',
                price: 89.99,
                image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
                category: 'DevOps',
                instructor: 'Robert Martinez',
                duration: '6 weeks',
                level: 'Intermediate'
            },
            {
                title: 'JavaScript Algorithms & Data Structures',
                description: 'Ace your coding interviews! Master essential algorithms and data structures using JavaScript. Cover arrays, linked lists, trees, graphs, sorting, and searching algorithms. Practice with hundreds of coding challenges. Perfect preparation for technical interviews at top tech companies.',
                price: 0,
                image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
                category: 'Computer Science',
                instructor: 'Chris Lee',
                duration: '8 weeks',
                level: 'Intermediate'
            }
        ];

        await Course.create(courses);
        console.log('✅ Created 8 courses');

        console.log('\n========================================');
        console.log('🎉 Database seeded successfully!');
        console.log('========================================');
        console.log('\n📧 Test User Credentials:');
        console.log('   john@example.com / password123');
        console.log('   jane@example.com / password123');
        console.log('   demo@example.com / demo123');
        console.log('\n🎫 Promo Code: BFSALE25 (50% off)\n');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://cyberwarefare.vercel.app',
        'https://cyberwarefare-frcn.vercel.app',
        'https://cyberwarefare-siddartha.vercel.app',
        /\.vercel\.app$/  // Allow all Vercel subdomains
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subscribe', subscriptionRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Course Subscription API is running!',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Course Subscription API - Black Friday Edition 🎉',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            subscriptions: '/api/subscribe',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Seed data
        await seedData();

        app.listen(PORT, () => {
            console.log(`
  🚀 Server running on port ${PORT}
  📚 Course Subscription API - Black Friday Edition
  🔗 http://localhost:${PORT}
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
