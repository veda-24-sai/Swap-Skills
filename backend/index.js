const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillswap';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('SkillSwap Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 