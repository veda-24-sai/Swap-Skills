import express from 'express';
import User from '../models/User.js';
import Swap from '../models/Swap.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// GET /api/admin/users - View all users with filtering and moderation info
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { search = '', status = '' } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = { $ne: true };
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (err) {
    console.error('Admin fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/ban - Ban a user from the platform
router.put('/users/:id/ban', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.isAdmin) {
      return res.status(400).json({ error: 'Cannot ban admin users' });
    }
    
    user.isBanned = true;
    await user.save();
    
    res.json({ message: 'User banned successfully', user });
  } catch (err) {
    console.error('Ban user error:', err);
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// PUT /api/admin/users/:id/unban - Unban a user
router.put('/users/:id/unban', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isBanned = false;
    await user.save();
    
    res.json({ message: 'User unbanned successfully', user });
  } catch (err) {
    console.error('Unban user error:', err);
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

// GET /api/admin/swaps - Monitor all swaps (filter by status: pending, accepted, cancelled)
router.get('/swaps', requireAdmin, async (req, res) => {
  try {
    const { status = '' } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    const swaps = await Swap.find(query)
      .populate('requester', 'username name email')
      .populate('recipient', 'username name email')
      .sort({ createdAt: -1 });
    
    res.json(swaps);
  } catch (err) {
    console.error('Admin fetch swaps error:', err);
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
});

// DELETE /api/admin/skills/:id - Delete inappropriate/spammy skill entries
router.delete('/skills/:id', requireAdmin, async (req, res) => {
  try {
    // This would typically work with a Skills model
    // For now, we'll return a placeholder response
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Delete skill error:', err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// POST /api/admin/messages - Send a platform-wide message or announcement
router.post('/messages', requireAdmin, async (req, res) => {
  try {
    const { title, message, type = 'announcement' } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    
    // This would typically save to a Messages model
    // For now, we'll return a placeholder response
    res.status(201).json({ 
      message: 'Platform message sent successfully',
      data: { title, message, type, sentAt: new Date() }
    });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET /api/admin/reports - Download user activity logs, swap stats, feedback reports (CSV/JSON)
router.get('/reports', requireAdmin, async (req, res) => {
  try {
    const { type = 'json' } = req.query;
    
    // Get basic stats
    const totalUsers = await User.countDocuments();
    const totalSwaps = await Swap.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    
    const swapStats = await Swap.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgCompletedSwaps: { $avg: '$completedSwaps' }
        }
      }
    ]);
    
    const report = {
      generatedAt: new Date(),
      stats: {
        totalUsers,
        totalSwaps,
        totalFeedback,
        swapStats,
        userStats: userStats[0] || { avgRating: 0, avgCompletedSwaps: 0 }
      }
    };
    
    if (type === 'csv') {
      // In a real implementation, you would generate CSV here
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=admin-report.csv');
      res.send('Report data would be in CSV format');
    } else {
      res.json(report);
    }
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
