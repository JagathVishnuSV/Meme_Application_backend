const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registration Function
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email or username already exists
        const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Function
const loginUser = async (req, res) => {
    try {
        const { login, password } = req.body; // Login can be either username or email

        console.log(`🔍 Searching for user: ${login}`);

        // Find user by username or email
        const user = await User.findOne({ $or: [{ email: login }, { username: login }] });

        if (!user) {
            console.log('👤 User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`👤 Found user: ${user.username}`);

        // Compare entered password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token if login is successful
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log(`✅ Password match: ${isPasswordValid}`);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser };
