const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  avatar: { type: String },
  rating: { type: Number, default: 0 },
  skillsOffered: [{ type: String }],
  skillsWanted: [{ type: String }],
  availability: { type: String },
  bio: { type: String },
  experience: { type: String },
  completedSwaps: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', UserSchema); 