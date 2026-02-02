const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a course title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a course description'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'General'
    },
    instructor: {
        type: String,
        default: 'Expert Instructor'
    },
    duration: {
        type: String,
        default: '4 weeks'
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual to check if course is free
courseSchema.virtual('isFree').get(function () {
    return this.price === 0;
});

// Ensure virtuals are included in JSON output
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
