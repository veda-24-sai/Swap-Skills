import express from 'express';
import passport from 'passport';
import multer from 'multer';
import path from 'path';
import User from '../models/User.js';

const router = express.Router();

// Multer setup for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, ${Date.now()}-${Math.round(Math.random() * 1e9)}${ext});
  },
});
const upload = multer({ storage });

// Register - Only essential fields
router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log('Registration attempt:', { email, username });
    
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required.' });
    }
    
    const avatar = req.file ? /uploads/${req.file.filename} : undefined;
    const user = new User({ email, username, avatar });
    
    await User.register(user, password);
    console.log('User registered successfully:', user.username);
    
    // Login the user after registration
    req.login(user, (err) => {
      if (err) {
        console.error('Login after registration failed:', err);
        return res.status(500).json({ error: 'Login after registration failed.' });
      }
      
      console.log('User logged in after registration:', user.username);
      res.json({ 
        message: 'Registration successful', 
        user: { 
          _id: user._id,
          email: user.email, 
          username: user.username, 
          avatar: user.avatar,
          profileCompleted: user.profileCompleted 
        } 
      });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', (req, res, next) => {
  console.log('Login attempt:', req.body.email);
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Passport authentication error:', err);
      return next(err);
    }
    
    if (!user) {
      console.log('Authentication failed:', info);
      return res.status(401).json({ error: info.message || 'Invalid credentials' });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      
      console.log('User logged in successfully:', user.username);
      console.log('Session ID:', req.sessionID);
      
      res.json({ 
        message: 'Login successful', 
        user: { 
          _id: user._id,
          email: user.email, 
          username: user.username, 
          avatar: user.avatar,
          profileCompleted: user.profileCompleted,
          name: user.name,
          location: user.location,
          rating: user.rating,
          skillsOffered: user.skillsOffered,
          skillsWanted: user.skillsWanted,
          availability: user.availability,
          bio: user.bio,
          experience: user.experience,
          completedSwaps: user.completedSwaps,
          isAdmin: user.isAdmin
        } 
      });
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  console.log('Logout attempt for user:', req.user ? req.user.username : 'None');
  
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Session destroy failed' });
      }
      
      res.clearCookie('connect.sid');
      console.log('User logged out successfully');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Get current user
router.get('/me', (req, res) => {
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Auth check - User:', req.user ? req.user.username : 'None');
  console.log('Auth check - isAuthenticated:', req.isAuthenticated());
  
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  // Return all relevant user fields
  const {
    _id, email, username, avatar, name, location, rating,
    skillsOffered, skillsWanted, availability, bio, experience,
    completedSwaps, isAdmin, profileCompleted
  } = req.user;
  
  const userData = {
    _id, email, username, avatar, name, location, rating,
    skillsOffered, skillsWanted, availability, bio, experience,
    completedSwaps, isAdmin, profileCompleted
  };
  
  console.log('Returning user data:', userData);
  res.json(userData);
});

// Update profile - Complete profile after registration
router.put('/profile', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      name,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      bio,
      experience
    } = req.body;

    const updateData = {
      name: name || '',
      location: location || '',
      skillsOffered: skillsOffered ? (Array.isArray(skillsOffered) ? skillsOffered : skillsOffered.split(',').map(s => s.trim())) : [],
      skillsWanted: skillsWanted ? (Array.isArray(skillsWanted) ? skillsWanted : skillsWanted.split(',').map(s => s.trim())) : [],
      availability: availability || '',
      bio: bio || '',
      experience: experience || '',
      profileCompleted: true
    };

    // Handle avatar update if provided
    if (req.file) {
      updateData.avatar = /uploads/${req.file.filename};
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    console.log('Profile updated for user:', updatedUser.username);

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar,
        name: updatedUser.name,
        location: updatedUser.location,
        rating: updatedUser.rating,
        skillsOffered: updatedUser.skillsOffered,
        skillsWanted: updatedUser.skillsWanted,
        availability: updatedUser.availability,
        bio: updatedUser.bio,
        experience: updatedUser.experience,
        completedSwaps: updatedUser.completedSwaps,
        isAdmin: updatedUser.isAdmin,
        profileCompleted: updatedUser.profileCompleted
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
