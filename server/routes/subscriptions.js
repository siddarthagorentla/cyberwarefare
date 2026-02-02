const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// Valid promo code configuration
const VALID_PROMO = {
    code: process.env.PROMO_CODE || 'BFSALE25',
    discount: parseInt(process.env.PROMO_DISCOUNT) || 50
};

// @route   POST /api/subscribe
// @desc    Subscribe to a course
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { courseId, promoCode } = req.body;
        const userId = req.user._id;

        // Validate courseId
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if already subscribed
        const existingSubscription = await Subscription.findOne({ userId, courseId });
        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'You are already subscribed to this course'
            });
        }

        let pricePaid = course.price;
        let discountApplied = 0;
        let promoCodeUsed = null;

        // Handle paid courses
        if (course.price > 0) {
            // Promo code is required for paid courses
            if (!promoCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Promo code is required for paid courses'
                });
            }

            // Validate promo code
            if (promoCode.toUpperCase() !== VALID_PROMO.code) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid promo code'
                });
            }

            // Apply discount
            discountApplied = VALID_PROMO.discount;
            pricePaid = course.price * (1 - discountApplied / 100);
            promoCodeUsed = VALID_PROMO.code;
        }

        // Create subscription
        const subscription = await Subscription.create({
            userId,
            courseId,
            pricePaid,
            originalPrice: course.price,
            promoCodeUsed,
            discountApplied
        });

        // Populate course details for response
        await subscription.populate('courseId');

        res.status(201).json({
            success: true,
            message: course.price > 0
                ? `Successfully subscribed! You saved ${discountApplied}% with promo code.`
                : 'Successfully subscribed to free course!',
            data: {
                subscriptionId: subscription._id,
                course: subscription.courseId,
                originalPrice: course.price,
                pricePaid,
                discountApplied,
                promoCodeUsed,
                subscribedAt: subscription.subscribedAt
            }
        });
    } catch (error) {
        console.error('Subscribe error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You are already subscribed to this course'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during subscription'
        });
    }
});

// @route   POST /api/subscribe/validate-promo
// @desc    Validate a promo code
// @access  Private
router.post('/validate-promo', protect, async (req, res) => {
    try {
        const { promoCode, courseId } = req.body;

        if (!promoCode) {
            return res.status(400).json({
                success: false,
                message: 'Promo code is required'
            });
        }

        // Check course exists and get price
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Validate promo code
        if (promoCode.toUpperCase() !== VALID_PROMO.code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid promo code',
                valid: false
            });
        }

        // Calculate discounted price
        const discountedPrice = course.price * (1 - VALID_PROMO.discount / 100);

        res.json({
            success: true,
            message: `Promo code valid! ${VALID_PROMO.discount}% discount applied.`,
            valid: true,
            data: {
                originalPrice: course.price,
                discountedPrice,
                discountPercentage: VALID_PROMO.discount,
                savings: course.price - discountedPrice
            }
        });
    } catch (error) {
        console.error('Validate promo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during promo validation'
        });
    }
});

// @route   GET /api/subscribe/my-courses
// @desc    Get all courses user is subscribed to
// @access  Private
router.get('/my-courses', protect, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user._id })
            .populate('courseId')
            .sort({ subscribedAt: -1 });

        res.json({
            success: true,
            count: subscriptions.length,
            data: subscriptions.map(sub => ({
                subscriptionId: sub._id,
                course: sub.courseId,
                pricePaid: sub.pricePaid,
                originalPrice: sub.originalPrice,
                discountApplied: sub.discountApplied,
                promoCodeUsed: sub.promoCodeUsed,
                subscribedAt: sub.subscribedAt
            }))
        });
    } catch (error) {
        console.error('Get my courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching subscriptions'
        });
    }
});

// @route   GET /api/subscribe/check/:courseId
// @desc    Check if user is subscribed to a course
// @access  Private
router.get('/check/:courseId', protect, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            userId: req.user._id,
            courseId: req.params.courseId
        });

        res.json({
            success: true,
            isSubscribed: !!subscription,
            subscription: subscription || null
        });
    } catch (error) {
        console.error('Check subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
