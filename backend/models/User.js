import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  avatar: { type: String }, 
  // Optional fields that can be filled later
  name: { type: String, default: '' }, 
  location: { type: String, default: '' },
  rating: { type: Number, default: 4.5 },
  skillsOffered: [{ type: String }],
  skillsWanted: [{ type: String }],
  availability: { type: String, default: '' },
  bio: { type: String, default: '' },
  experience: { type: String, default: '' },
  completedSwaps: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false }, // For admin access
  isBanned: { type: Boolean, default: false }, // For admin moderation
  profileCompleted: { type: Boolean, default: true }, // Track if profile is complete
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email', // use email for login
  errorMessages: {
    UserExistsError: 'A user with the given email is already registered.'
  }
});

const User = mongoose.model('User', userSchema);

export default User;
