import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/users?search=...&skills=...
router.get('/users', async (req, res) => {
  try {
    const { search = '', skills = '' } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skillsOffered: { $regex: search, $options: 'i' } },
        // Removed skillsWanted from search
      ];
    }
    
    if (skills) {
      const skillsArr = Array.isArray(skills) ? skills : skills.split(',');
      query.skillsOffered = { $in: skillsArr };
    }
    
    const users = await User.find(query).sort({ rating: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users/:id - Update user profile
router.put('/users/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user is updating their own profile or is admin
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { name, location, availability, bio, experience } = req.body;
    
    const updateData = {
      name: name || '',
      location: location || '',
      availability: availability || '',
      bio: bio || '',
      experience: experience || ''
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// DELETE /api/users/:id - Delete user account
router.delete('/users/:id', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user is deleting their own account or is admin
    if (req.user._id.toString() !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user account' });
  }
});

// Skills routes
router.get('/skills', (req, res) => {
  res.json([
    { id: 1, name: 'React', category: 'Frontend', users: 15 },
    { id: 2, name: 'Node.js', category: 'Backend', users: 12 },
    { id: 3, name: 'TypeScript', category: 'Language', users: 18 },
    { id: 4, name: 'Python', category: 'Language', users: 10 },
    { id: 5, name: 'Vue.js', category: 'Frontend', users: 8 },
    { id: 6, name: 'Java', category: 'Language', users: 6 }
  ]);
});

// POST /api/skills/offer - Add a skill to user's "offered" list
router.post('/skills/offer', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({ error: 'Skill is required' });
    }

    if (!req.user.skillsOffered.includes(skill)) {
      req.user.skillsOffered.push(skill);
      await req.user.save();
    }

    res.json({ message: 'Skill added to offered list', skillsOffered: req.user.skillsOffered });
  } catch (err) {
    console.error('Add offered skill error:', err);
    res.status(500).json({ error: 'Failed to add skill to offered list' });
  }
});

// POST /api/skills/request - Add a skill to user's "wanted" list
router.post('/skills/request', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { skill } = req.body;
    if (!skill) {
      return res.status(400).json({ error: 'Skill is required' });
    }

    if (!req.user.skillsWanted.includes(skill)) {
      req.user.skillsWanted.push(skill);
      await req.user.save();
    }

    res.json({ message: 'Skill added to wanted list', skillsWanted: req.user.skillsWanted });
  } catch (err) {
    console.error('Add wanted skill error:', err);
    res.status(500).json({ error: 'Failed to add skill to wanted list' });
  }
});

// DELETE /api/skills/offer/:skill - Delete a skill from user's "offered" list
router.delete('/skills/offer/:skill', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const skill = req.params.skill;
    req.user.skillsOffered = req.user.skillsOffered.filter(s => s !== skill);
    await req.user.save();

    res.json({ message: 'Skill removed from offered list', skillsOffered: req.user.skillsOffered });
  } catch (err) {
    console.error('Remove offered skill error:', err);
    res.status(500).json({ error: 'Failed to remove skill from offered list' });
  }
});

// DELETE /api/skills/request/:skill - Delete a skill from user's "wanted" list
router.delete('/skills/request/:skill', async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const skill = req.params.skill;
    req.user.skillsWanted = req.user.skillsWanted.filter(s => s !== skill);
    await req.user.save();

    res.json({ message: 'Skill removed from wanted list', skillsWanted: req.user.skillsWanted });
  } catch (err) {
    console.error('Remove wanted skill error:', err);
    res.status(500).json({ error: 'Failed to remove skill from wanted list' });
  }
});

// GET /api/skills/search?name=SkillName - Search for users by skill name
router.get('/skills/search', async (req, res) => {
  try {
    const { name = '' } = req.query;
    
    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const users = await User.find({
      $or: [
        { skillsOffered: { $regex: name, $options: 'i' } },
        { skillsWanted: { $regex: name, $options: 'i' } }
      ]
    }).select('username name avatar skillsOffered skillsWanted rating');

    res.json(users);
  } catch (err) {
    console.error('Search skills error:', err);
    res.status(500).json({ error: 'Failed to search for skills' });
  }
});

// Projects routes
router.get('/projects', (req, res) => {
  res.json([
    { 
      id: 1, 
      title: 'E-commerce Platform', 
      description: 'A full-stack e-commerce solution',
      skills: ['React', 'Node.js', 'MongoDB'],
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Task Management App', 
      description: 'Collaborative task management tool',
      skills: ['Vue.js', 'Python', 'PostgreSQL'],
      status: 'completed'
    }
  ]);
});

// Requests routes
router.get('/requests', (req, res) => {
  res.json([
    { 
      id: 1, 
      title: 'Need React Developer', 
      description: 'Looking for a React developer for a 3-month project',
      skills: ['React', 'TypeScript'],
      status: 'open',
      budget: '$5000'
    },
    { 
      id: 2, 
      title: 'Backend API Development', 
      description: 'Need help building REST API with Node.js',
      skills: ['Node.js', 'Express', 'MongoDB'],
      status: 'in-progress',
      budget: '$3000'
    }
  ]);
});

export default router;
