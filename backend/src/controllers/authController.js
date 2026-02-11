import * as bcrypt from 'bcryptjs'
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
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
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();
    return res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        email,
        username
      }
    });
  } catch (error) {
    console.log(`Error executing your command: ${error.message}`);
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const login = async (req, res) => {
  //console.log(req.url);
  res.send('Login route');
}