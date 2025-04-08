import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "laptop-management-secret";

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/laptopManagement')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const laptopSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  specs: {
    processor: String,
    ram: String,
    storage: String,
    display: String
  },
  status: { type: String, enum: ['available', 'assigned', 'maintenance'], default: 'available' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Laptop = mongoose.model('Laptop', laptopSchema);

// Middleware for authentication
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware for admin authorization
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify token and get user data
app.get('/api/auth/verify', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Laptop Routes
// Get all laptops (admin only)
app.get('/api/laptops', authenticate, adminOnly, async (req, res) => {
  try {
    const laptops = await Laptop.find().populate('assignedTo', 'name email');
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's assigned laptops
app.get('/api/my-laptops', authenticate, async (req, res) => {
  try {
    const laptops = await Laptop.find({ assignedTo: req.user._id });
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new laptop (admin only)
app.post('/api/laptops', authenticate, adminOnly, async (req, res) => {
  try {
    const { brand, model, serialNumber, specs } = req.body;
    
    // Check if laptop with serial number already exists
    const existingLaptop = await Laptop.findOne({ serialNumber });
    if (existingLaptop) {
      return res.status(400).json({ message: 'Laptop with this serial number already exists' });
    }
    
    const laptop = new Laptop({
      brand,
      model,
      serialNumber,
      specs
    });
    
    await laptop.save();
    res.status(201).json(laptop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update laptop (admin only)
app.put('/api/laptops/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { brand, model, serialNumber, specs, status, assignedTo } = req.body;
    
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    
    // Update fields
    if (brand) laptop.brand = brand;
    if (model) laptop.model = model;
    if (serialNumber) laptop.serialNumber = serialNumber;
    if (specs) laptop.specs = specs;
    if (status) laptop.status = status;
    
    // If assigning to a user
    if (assignedTo) {
      laptop.assignedTo = assignedTo;
      laptop.status = 'assigned';
    } else if (status === 'available') {
      laptop.assignedTo = null;
    }
    
    laptop.updatedAt = Date.now();
    
    await laptop.save();
    res.json(laptop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete laptop (admin only)
app.delete('/api/laptops/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    
    await laptop.deleteOne();
    res.json({ message: 'Laptop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User Routes (Admin only)
app.get('/api/users', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single user
app.get('/api/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
app.put('/api/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    
    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has any assigned laptops
    const assignedLaptops = await Laptop.find({ assignedTo: user._id });
    if (assignedLaptops.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with assigned laptops. Please reassign or return laptops first.' 
      });
    }
    
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available laptops
app.get('/api/laptops/available', authenticate, async (req, res) => {
  try {
    const laptops = await Laptop.find({ status: 'available' });
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Borrow a laptop
app.post('/api/laptops/:id/borrow', authenticate, async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    
    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    
    if (laptop.status !== 'available') {
      return res.status(400).json({ message: 'Laptop is not available for borrowing' });
    }
    
    // Check if user already has a laptop assigned
    const userLaptops = await Laptop.find({ assignedTo: req.user._id, status: 'assigned' });
    if (userLaptops.length > 0) {
      return res.status(400).json({ message: 'You already have a laptop assigned' });
    }
    
    laptop.status = 'assigned';
    laptop.assignedTo = req.user._id;
    laptop.updatedAt = Date.now();
    
    await laptop.save();
    res.json(laptop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Return a laptop
app.post('/api/laptops/:id/return', authenticate, async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    
    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    
    if (laptop.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this laptop' });
    }
    
    laptop.status = 'available';
    laptop.assignedTo = null;
    laptop.updatedAt = Date.now();
    
    await laptop.save();
    res.json(laptop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get laptops under maintenance
app.get('/api/laptops/maintenance', authenticate, adminOnly, async (req, res) => {
  try {
    const laptops = await Laptop.find({ status: 'maintenance' }).populate('assignedTo', 'name email');
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new user (admin only)
app.post('/api/users', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    
    await user.save();
    
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create initial admin user if none exists
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created: admin@example.com / admin123');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createAdminUser();
});
