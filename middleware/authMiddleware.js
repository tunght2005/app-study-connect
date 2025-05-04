const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Member = require('../models/Member');

// Middleware xác thực
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token!' });
    }

    try {
        const decoded = jwt.verify(token, 'secretkey'); // Thay 'secretkey' bằng khóa bí mật của bạn

        // Kiểm tra trong bảng Admin
        let user = await Admin.findById(decoded.id).select('-password');
        if (!user) {
            // Nếu không tìm thấy trong Admin, kiểm tra trong Member
            user = await Member.findById(decoded.id).select('-password');
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found!' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Not authorized, token failed!' });
    }
};

// Middleware phân quyền
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this role!' });
        }
        next();
    };
};

exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Nếu vai trò là 'admin', kiểm tra xem người dùng hiện tại có phải admin không
        if (role === 'admin' && (!req.user || req.user.role !== 'admin')) {
            return res.status(403).json({ success: false, message: 'Only admins can create admin accounts!' });
        }

        // Mặc định vai trò là 'user' nếu không được cung cấp
        const user = await Member.create({ username, password, role: role || 'user' });

        res.status(201).json({
            success: true,
            message: 'User registered!',
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};