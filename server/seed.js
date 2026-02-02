require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected for seeding...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Dummy Users Data
const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
    },
    {
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'demo123'
    }
];

// Courses Data (At least 5 courses - mix of free and paid)
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

// Seed function
const seedDatabase = async () => {
    try {
        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Course.deleteMany({});

        // Seed users
        console.log('Seeding users...');
        const createdUsers = await User.create(users);
        console.log(`✅ Created ${createdUsers.length} users`);

        // Seed courses
        console.log('Seeding courses...');
        const createdCourses = await Course.create(courses);
        console.log(`✅ Created ${createdCourses.length} courses`);

        console.log('\n========================================');
        console.log('🎉 Database seeded successfully!');
        console.log('========================================\n');

        console.log('📧 Test User Credentials:');
        console.log('----------------------------------------');
        users.forEach(user => {
            console.log(`   Email: ${user.email}`);
            console.log(`   Password: ${user.password}`);
            console.log('----------------------------------------');
        });

        console.log('\n📚 Created Courses:');
        createdCourses.forEach(course => {
            console.log(`   - ${course.title} (${course.price === 0 ? 'FREE' : '$' + course.price})`);
        });

        console.log('\n🎫 Valid Promo Code: BFSALE25 (50% discount)');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
