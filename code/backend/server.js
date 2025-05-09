import express from "express";
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import itemRoutes from './routes/itemRoute.js';
import orderRoutes from './routes/orderRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

import cors from 'cors';

dotenv.config();

// Connect to database
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/support', supportRoutes);


// get user details:
import User from './models/user_model.js'; 

// Route to get user details by email
app.get('/api/users/details', async (req, res) => {
  const { email } = req.query;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 