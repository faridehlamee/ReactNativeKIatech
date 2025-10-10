"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const path_1 = __importDefault(require("path"));
let serviceAccount;
try {
    if (process.env.FIREBASE_ADMIN_KEY) {
        serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
        console.log('✅ Firebase Admin SDK initialized from environment variable');
    }
    else {
        const serviceAccountPath = path_1.default.join(__dirname, '../../firebase-admin-key.json');
        serviceAccount = require(serviceAccountPath);
        console.log('✅ Firebase Admin SDK initialized from local file');
    }
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
}
catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error);
    console.error('Make sure FIREBASE_ADMIN_KEY environment variable is set in production');
}
class FirebaseService {
    static async sendNotificationToDevice(token, title, body, data) {
        try {
            const message = {
                token,
                notification: {
                    title,
                    body,
                },
                data: data || {},
                android: {
                    priority: 'high',
                    notification: {
                        icon: 'ic_notification',
                        color: '#2563eb',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            alert: {
                                title,
                                body,
                            },
                            badge: 1,
                            sound: 'default',
                        },
                    },
                },
            };
            const response = await firebase_admin_1.default.messaging().send(message);
            console.log('✅ Notification sent successfully:', response);
            return { success: true, messageId: response };
        }
        catch (error) {
            console.error('❌ Failed to send notification:', error);
            return { success: false, error: error.message || 'Unknown error' };
        }
    }
    static async sendNotificationToMultipleDevices(tokens, title, body, data, channelId) {
        try {
            const message = {
                tokens,
                notification: {
                    title,
                    body,
                },
                data: data || {},
                android: {
                    priority: 'high',
                    notification: {
                        icon: 'ic_notification',
                        color: '#2563eb',
                        channelId: channelId || 'default',
                        sound: 'default',
                        tag: 'kiatech_notification',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            alert: {
                                title,
                                body,
                            },
                            badge: 1,
                            sound: 'default',
                        },
                    },
                },
            };
            const response = await firebase_admin_1.default.messaging().sendEachForMulticast(message);
            console.log('✅ Multicast notification sent:', response);
            return {
                success: true,
                successCount: response.successCount,
                failureCount: response.failureCount,
                responses: response.responses
            };
        }
        catch (error) {
            console.error('❌ Failed to send multicast notification:', error);
            return { success: false, error: error.message || 'Unknown error' };
        }
    }
    static async sendNotificationToAllSubscribers(title, body, data) {
        try {
            const message = {
                topic: 'all_subscribers',
                notification: {
                    title,
                    body,
                },
                data: data || {},
                android: {
                    priority: 'high',
                    notification: {
                        icon: 'ic_notification',
                        color: '#2563eb',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            alert: {
                                title,
                                body,
                            },
                            badge: 1,
                            sound: 'default',
                        },
                    },
                },
            };
            const response = await firebase_admin_1.default.messaging().send(message);
            console.log('✅ Topic notification sent:', response);
            return { success: true, messageId: response };
        }
        catch (error) {
            console.error('❌ Failed to send topic notification:', error);
            return { success: false, error: error.message || 'Unknown error' };
        }
    }
    static async validateToken(token) {
        try {
            await firebase_admin_1.default.messaging().send({
                token,
                data: { test: 'true' },
            }, true);
            return true;
        }
        catch (error) {
            console.error('❌ Invalid FCM token:', error);
            return false;
        }
    }
}
exports.FirebaseService = FirebaseService;
exports.default = FirebaseService;
//# sourceMappingURL=firebaseService.js.map