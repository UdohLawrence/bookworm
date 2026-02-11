import * as bcrypt from 'bcryptjs'
import User from '../models/User.js';
import { generateToken } from '../lib/jwt.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (username.length < 5) {
      return res.status(400).json({ message: 'Username must be at least 5 characters long' });
    }
    const usernameInUse = await User.findOne({ username });
    if (usernameInUse) {
      return res.status(400).json({ message: 'Username already in use' });
    }
    const emailInUse = await User.findOne({ email });
    if (emailInUse) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    /***********************************************************

    Implement this later when we have the frontend ready to generate profile images based on username
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    *************************************************************/

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      //profileImage
    });
    await newUser.save();

    const token = generateToken(newUser._id);

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profileImage: newUser.profileImage || ''
      },
      token
    });
  } catch (error) {
    console.log(`Error executing your command: ${error.message}`);
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    return res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage || ''
      },
      token
    });
  } catch (error) {
    console.log(`Error executing your command: ${error.message}`);
    return res.status(500).json({
      message: error.message,
    })
  }
}