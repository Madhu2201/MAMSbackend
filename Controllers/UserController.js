
import User from '../Models/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res) => {
  const { username, password, role, baseId } = req.body;

  try {
    const userCount = await User.countDocuments();

    if (userCount > 0 && (!req.user || req.user.role !== 'Admin')) {
      return res.status(403).json({ message: 'Only Admin can register users' });
    }

   if (role === 'Base Commander' && !baseId) {
  return res.status(400).json({ message: 'Base Commander must be assigned to a base' });
}
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      passwordHash: hashedPassword,
      role,
      baseId
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const loginUser = async (req, res) => {
  const { username, passwordHash } = req.body;

  console.log('Login request received');
  console.log('Username:', username);
  console.log('Password:', passwordHash); 

  if (!username || !passwordHash) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username }).populate('baseId');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    console.log('User found:', user);
    console.log('Stored hash:', user.passwordHash);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        baseId: user.baseId?._id || null
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        baseId: user.baseId?._id || null,
        baseName: user.baseId?.name || null
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
