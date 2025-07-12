import express from 'express';
import Feedback from '../models/Feedback.js';
import Swap from '../models/Swap.js';
import User from '../models/User.js';

const router = express.Router();

// POST /api/feedback/:swapId - Submit feedback/rating after a completed swap
router.post('/:swapId', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { rating, comment } = req.body;
    const swapId = req.params.swapId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if swap exists and is completed
    const swap = await Swap.findById(swapId);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    if (swap.status !== 'completed') {
      return res.status(400).json({ error: 'Feedback can only be submitted for completed swaps' });
    }

    // Check if user is part of this swap
    if (swap.requester.toString() !== req.user._id.toString() && 
        swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to submit feedback for this swap' });
    }

    // Determine who the feedback is for
    const toUser = swap.requester.toString() === req.user._id.toString() 
      ? swap.recipient 
      : swap.requester;

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      swap: swapId,
      fromUser: req.user._id,
      toUser: toUser
    });

    if (existingFeedback) {
      return res.status(400).json({ error: 'Feedback already submitted for this swap' });
    }

    const feedback = new Feedback({
      swap: swapId,
      fromUser: req.user._id,
      toUser: toUser,
      rating,
      comment: comment || ''
    });

    await feedback.save();

    // Update user's average rating
    const userFeedbacks = await Feedback.find({ toUser: toUser });
    const avgRating = userFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / userFeedbacks.length;
    
    await User.findByIdAndUpdate(toUser, { rating: Math.round(avgRating * 10) / 10 });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// GET /api/feedback/user/:userId - Get all feedback received by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ toUser: req.params.userId })
      .populate('fromUser', 'username name avatar')
      .populate('swap', 'offeredSkill requestedSkill')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error('Fetch user feedback error:', err);
    res.status(500).json({ error: 'Failed to fetch user feedback' });
  }
});

// GET /api/feedback/swap/:swapId - Get feedback for a specific swap interaction
router.get('/swap/:swapId', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const swap = await Swap.findById(req.params.swapId);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is part of this swap
    if (swap.requester.toString() !== req.user._id.toString() && 
        swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view feedback for this swap' });
    }

    const feedbacks = await Feedback.find({ swap: req.params.swapId })
      .populate('fromUser', 'username name avatar')
      .populate('toUser', 'username name avatar')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error('Fetch swap feedback error:', err);
    res.status(500).json({ error: 'Failed to fetch swap feedback' });
  }
});

export default router;
