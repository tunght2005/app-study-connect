const User = require('../models/Member');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Member = require('../models/Member');

// Tạo token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, 'secretkey', { expiresIn: '1d' }); // Thay 'secretkey' bằng khóa bí mật của bạn
};

// Đăng ký user
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Mặc định vai trò là 'member'
        const user = await User.create({ username, password, role: 'member' });

        res.status(201).json({
            success: true,
            message: 'User registered!',
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Đăng ký admin
exports.registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Tạo tài khoản admin
        const admin = await Admin.create({ username, password });

        res.status(201).json({
            success: true,
            message: 'Admin registered!',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Đăng ký member
exports.registerMember = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Tạo tài khoản member
        const member = await Member.create({ username, password });

        res.status(201).json({
            success: true,
            message: 'Member registered!',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        let user;
        if (role === 'admin') {
            user = await Admin.findOne({ username });
        } else if (role === 'member') {
            user = await Member.findOne({ username });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid role!' });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password!' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password!' });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user._id, role: role },
            'secretkey', // Thay 'secretkey' bằng khóa bí mật của bạn
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token: token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};