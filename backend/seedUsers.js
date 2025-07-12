const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const users = [
  {
    name: 'Sarah Chen',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    skillsOffered: ['JavaScript', 'React', 'Web Design'],
    skillsWanted: ['Guitar', 'Photography'],
    availability: 'Weekends, Evenings',
    bio: 'Full-stack developer with 5+ years experience. Love teaching coding and always eager to learn new creative skills!',
    experience: '5+ years in web development',
    completedSwaps: 23,
  },
  {
    name: 'Marcus Johnson',
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    skillsOffered: ['Guitar', 'Music Theory', 'Piano'],
    skillsWanted: ['Python', 'Data Science'],
    availability: 'Weekdays after 6pm',
    bio: 'Professional musician and music teacher. Looking to transition into tech and learn programming skills.',
    experience: '10+ years in music education',
    completedSwaps: 18,
  },
  {
    name: 'Elena Rodriguez',
    location: 'Miami, FL',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    skillsOffered: ['Spanish', 'Cooking', 'Photography'],
    skillsWanted: ['Yoga', 'Meditation'],
    availability: 'Flexible',
    bio: 'Native Spanish speaker and food enthusiast. Professional photographer looking to find inner peace through mindfulness practices.',
    experience: '8+ years in photography',
    completedSwaps: 31,
  },
  {
    name: 'David Kim',
    location: 'Seattle, WA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    skillsOffered: ['Python', 'Machine Learning', 'Chess'],
    skillsWanted: ['Cooking', 'Guitar'],
    availability: 'Weekends',
    bio: 'Data scientist and chess enthusiast. Want to learn practical life skills like cooking and music to balance out my technical background.',
    experience: '7+ years in data science',
    completedSwaps: 15,
  },
  {
    name: 'Aisha Patel',
    location: 'New York, NY',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    skillsOffered: ['Yoga', 'Meditation', 'Drawing'],
    skillsWanted: ['JavaScript', 'Marketing'],
    availability: 'Morning sessions',
    bio: 'Certified yoga instructor and artist. Looking to build my online presence and learn web development for my wellness business.',
    experience: '6+ years in wellness coaching',
    completedSwaps: 27,
  },
  {
    name: 'Alex Thompson',
    location: 'Denver, CO',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    skillsOffered: ['Photoshop', 'Marketing', 'Excel'],
    skillsWanted: ['Photography', 'Spanish'],
    availability: 'Evenings, Weekends',
    bio: 'Digital marketing specialist with design skills. Want to improve my photography and learn Spanish for upcoming travel adventures.',
    experience: '4+ years in digital marketing',
    completedSwaps: 12,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/skillswap');
    await User.deleteMany();
    await User.insertMany(users);
    console.log('Sample users seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed(); 