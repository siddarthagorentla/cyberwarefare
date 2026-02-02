const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    pricePaid: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    promoCodeUsed: {
        type: String,
        default: null
    },
    discountApplied: {
        type: Number,
        default: 0
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate subscriptions
subscriptionSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
