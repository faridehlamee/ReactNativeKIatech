// Admin Panel JavaScript
const API_BASE_URL = 'https://reactnativekiatech-production.up.railway.app';

let authToken = localStorage.getItem('adminToken');
let users = [];

// Check API status
async function checkApiStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            document.getElementById('api-status').innerHTML = '✅ Online';
            document.getElementById('api-status').style.color = '#28a745';
        } else {
            document.getElementById('api-status').innerHTML = '❌ Offline';
            document.getElementById('api-status').style.color = '#dc3545';
        }
    } catch (error) {
        document.getElementById('api-status').innerHTML = '❌ Offline';
        document.getElementById('api-status').style.color = '#dc3545';
    }
}

// Login functionality
document.getElementById('login-btn').addEventListener('click', async function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            authToken = result.data.token;
            localStorage.setItem('adminToken', authToken);
            document.getElementById('auth-status').innerHTML = '✅ Logged in';
            document.getElementById('auth-status').style.color = '#28a745';
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            
            await loadUsers();
            await updateStats();
        } else {
            console.error('Login failed:', result);
            alert('Login failed: ' + result.message + '\n\nPlease check:\n1. Email: ' + email + '\n2. Password is correct\n3. User exists in database');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login error: ' + error.message);
    }
});

// Load users from API
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const result = await response.json();
        if (result.success) {
            users = result.data.users;
            displayUsers();
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Display users in the list
function displayUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.onclick = () => selectUser(user._id);
        
        const subscriptionClass = `subscription-${user.subscriptionType}`;
        
        userItem.innerHTML = `
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
            <span class="user-subscription ${subscriptionClass}">${user.subscriptionType.toUpperCase()}</span>
        `;
        
        userList.appendChild(userItem);
    });
}

// Select user for specific notification
let selectedUserId = null;
function selectUser(userId) {
    selectedUserId = userId;
    
    // Update visual selection
    document.querySelectorAll('.user-item').forEach(item => {
        item.style.backgroundColor = '';
    });
    event.target.closest('.user-item').style.backgroundColor = '#e3f2fd';
}

// Update stats
function updateStats() {
    const totalUsers = users.length;
    const freeUsers = users.filter(u => u.subscriptionType === 'free').length;
    const premiumUsers = users.filter(u => u.subscriptionType === 'premium').length;
    const enterpriseUsers = users.filter(u => u.subscriptionType === 'enterprise').length;
    
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('free-users').textContent = freeUsers;
    document.getElementById('premium-users').textContent = premiumUsers;
    document.getElementById('enterprise-users').textContent = enterpriseUsers;
}

// Toggle user selection visibility
function toggleUserSelection() {
    const target = document.getElementById('target').value;
    const userSelection = document.getElementById('user-selection');
    
    if (target === 'specific') {
        userSelection.style.display = 'block';
    } else {
        userSelection.style.display = 'none';
        selectedUserId = null;
    }
}

// Quick notification templates
function fillQuickNotification(type) {
    const titleInput = document.getElementById('title');
    const messageInput = document.getElementById('message');
    const typeSelect = document.getElementById('type');
    
    switch(type) {
        case 'promotion':
            titleInput.value = '🎉 Special Offer!';
            messageInput.value = 'Get 50% off on premium features! Limited time offer for our valued users.';
            typeSelect.value = 'success';
            break;
        case 'update':
            titleInput.value = '🔄 App Update Available';
            messageInput.value = 'New features and improvements are now available. Update your app for the best experience!';
            typeSelect.value = 'info';
            break;
        case 'alert':
            titleInput.value = '⚠️ Important Notice';
            messageInput.value = 'Scheduled maintenance will occur tonight from 2-4 AM. Some features may be temporarily unavailable.';
            typeSelect.value = 'warning';
            break;
    }
    
    updatePreview();
}

// Update notification preview
function updatePreview() {
    const title = document.getElementById('title').value || 'Notification Title';
    const message = document.getElementById('message').value || 'Notification message will appear here...';
    
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-message').textContent = message;
}

// Clear form
function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('message').value = '';
    document.getElementById('target').value = 'all';
    document.getElementById('type').value = 'info';
    document.getElementById('user-selection').style.display = 'none';
    selectedUserId = null;
    updatePreview();
}

// Send notification
document.getElementById('send-btn').addEventListener('click', async function() {
    if (!authToken) {
        alert('Please login first!');
        return;
    }
    
    const sendBtn = document.getElementById('send-btn');
    const status = document.getElementById('status');
    
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    const type = document.getElementById('type').value;
    const target = document.getElementById('target').value;
    
    if (!title || !message) {
        alert('Please fill in both title and message!');
        return;
    }
    
    // Build notification data
    const notificationData = {
        title: title,
        message: message,
        type: type
    };
    
    // Add targeting
    if (target === 'specific' && selectedUserId) {
        notificationData.userId = selectedUserId;
    } else if (target !== 'all') {
        notificationData.subscriptionType = target;
    }
    
    // Show loading state
    sendBtn.disabled = true;
    sendBtn.textContent = '⏳ Sending...';
    status.className = 'status loading';
    status.style.display = 'block';
    status.textContent = 'Sending notification...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(notificationData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            status.className = 'status success';
            status.textContent = `✅ Notification sent successfully! Sent to ${result.data?.targetUsers || 'users'} users.`;
            
            // Clear form
            clearForm();
        } else {
            status.className = 'status error';
            status.textContent = `❌ Error: ${result.message || 'Failed to send notification'}`;
        }
    } catch (error) {
        status.className = 'status error';
        status.textContent = `❌ Network Error: ${error.message}`;
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = '🚀 Send Notification';
    }
});

// Initialize
checkApiStatus();

// Check if already logged in
if (authToken) {
    document.getElementById('auth-status').innerHTML = '✅ Logged in';
    document.getElementById('auth-status').style.color = '#28a745';
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadUsers().then(updateStats);
}

// Update preview on input
document.getElementById('title').addEventListener('input', updatePreview);
document.getElementById('message').addEventListener('input', updatePreview);

// Update stats periodically
setInterval(() => {
    if (authToken) {
        checkApiStatus();
        loadUsers().then(updateStats);
    }
}, 30000);
