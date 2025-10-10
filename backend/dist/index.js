"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
console.log(`🔧 Starting with PORT: ${PORT}`);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.CORS_ORIGIN || 'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:8080'
    ],
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined'));
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
app.get('/admin', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../notification-admin.html'));
});
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/subscriptions', subscriptions_1.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
const connectDB = async () => {
    try {
        console.log('🔗 Attempting to connect to MongoDB...');
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kiatech';
        console.log('📋 MongoDB URI:', mongoURI.substring(0, 20) + '...');
        const connectionOptions = {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        };
        console.log('⏱️ Connecting with timeout...');
        await mongoose_1.default.connect(mongoURI, connectionOptions);
        console.log('✅ MongoDB connected successfully');
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
};
const startServer = async () => {
    try {
        console.log('🔧 Starting server...');
        console.log(`📋 Environment variables check:`);
        console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`   - PORT: ${process.env.PORT}`);
        console.log(`   - MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
        console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
        console.log(`   - FIREBASE_PROJECT_ID: ${process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set'}`);
        console.log('🔗 Starting database connection...');
        await connectDB();
        console.log('✅ Database connection completed');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
            console.log(`✅ Server successfully started and listening on port ${PORT}`);
        }).on('error', (err) => {
            console.error('❌ Server failed to start:', err);
            process.exit(1);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        console.error('❌ Error details:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map