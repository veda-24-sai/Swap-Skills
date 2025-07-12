import express from 'express';
import Swap from '../models/Swap.js';
import User from '../models/User.js';

const router = express.Router();

// POST /api/swaps - Send a swap request to another user
router.post('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { recipientId, offeredSkill, requestedSkill, message } = req.body;

    if (!recipientId || !offeredSkill || !requestedSkill) {
      return res.status(400).json({ error: 'Recipient ID, offered skill, and requested skill are required' });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient user not found' });
    }

    // Check if user is not sending request to themselves
    if (req.user._id.toString() === recipientId) {
      return res.status(400).json({ error: 'Cannot send swap request to yourself' });
    }

    const swap = new Swap({
      requester: req.user._id,
      recipient: recipientId,
      offeredSkill,
      requestedSkill,
      message: message || ''
    });

    await swap.save();
    res.status(201).json({ message: 'Swap request sent successfully', swap });
  } catch (err) {
    console.error('Swap creation error:', err);
    res.status(500).json({ error: 'Failed to create swap request' });
  }
});

// GET /api/swaps - Fetch all of the logged-in user's swaps
router.get('/', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const swaps = await Swap.find({
      $or: [
        { requester: req.user._id },
        { recipient: req.user._id }
      ]
    })
    .populate('requester', 'username name avatar')
    .populate('recipient', 'username name avatar')
    .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (err) {
    console.error('Fetch swaps error:', err);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// GET /api/swaps/:id - Get detailed information of a specific swap
router.get('/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const swap = await Swap.findById(req.params.id)
      .populate('requester', 'username name avatar')
      .populate('recipient', 'username name avatar');

    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is part of this swap
    if (swap.requester._id.toString() !== req.user._id.toString() && 
        swap.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this swap' });
    }

    res.json(swap);
  } catch (err) {
    console.error('Fetch swap error:', err);
    res.status(500).json({ error: 'Failed to fetch swap' });
  }
});

// PUT /api/swaps/:id/accept - Accept a pending swap request
router.put('/:id/accept', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is the recipient
    if (swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the recipient can accept swap requests' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Swap request is not pending' });
    }

    swap.status = 'accepted';
    swap.updatedAt = new Date();
    await swap.save();

    res.json({ message: 'Swap request accepted successfully', swap });
  } catch (err) {
    console.error('Accept swap error:', err);
    res.status(500).json({ error: 'Failed to accept swap request' });
  }
});

// PUT /api/swaps/:id/reject - Reject a pending swap request
router.put('/:id/reject', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is the recipient
    if (swap.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the recipient can reject swap requests' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Swap request is not pending' });
    }

    swap.status = 'rejected';
    swap.updatedAt = new Date();
    await swap.save();

    res.json({ message: 'Swap request rejected successfully', swap });
  } catch (err) {
    console.error('Reject swap error:', err);
    res.status(500).json({ error: 'Failed to reject swap request' });
  }
});

// DELETE /api/swaps/:id - Cancel a pending swap request
router.delete('/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found' });
    }

    // Check if user is the requester
    if (swap.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the requester can cancel swap requests' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending swap requests can be cancelled' });
    }

    swap.status = 'cancelled';
    swap.updatedAt = new Date();
    await swap.save();

    res.json({ message: 'Swap request cancelled successfully', swap });
  } catch (err) {
    console.error('Cancel swap error:', err);
    res.status(500).json({ error: 'Failed to cancel swap request' });
  }
});

export default router;
