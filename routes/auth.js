const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Đường dẫn đến authController.js
const { protect, authorize } = require('../middleware/authMiddleware'); // Đường dẫn đến authMiddleware.js

// Đăng ký admin
router.post('/register-admin', authController.registerAdmin);

// Đăng ký member
router.post('/register-member', authController.registerMember);

// Đăng nhập
router.post('/login', authController.login);

module.exports = router;