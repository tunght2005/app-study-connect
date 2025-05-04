const express = require('express');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat.js');
const groupRoutes = require('./routes/group.js');
const uploadRoutes = require('./routes/upload.js');
const authRoutes = require('./routes/auth.js'); // Import route auth.js
const connectDB = require('./db');
const { protect } = require('./middleware/authMiddleware.js');

const app = express();
const PORT = 3000;

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Tích hợp route auth.js trước middleware bảo vệ
app.use('/api/auth', authRoutes); // Tích hợp route auth.js

// Middleware bảo vệ tất cả các route còn lại
app.use((req, res, next) => {
    console.log(`Request path: ${req.path}`);
    if (req.path.startsWith('/api/auth')) {
        console.log('Bỏ qua xác thực cho route công khai');
        return next(); // Bỏ qua xác thực cho các route công khai
    }
    protect(req, res, next);
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);
app.use('/api/upload', uploadRoutes);

// Default route for '/'
app.get('/', (req, res) => {
    res.send('Welcome to StudyConect API!');
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});