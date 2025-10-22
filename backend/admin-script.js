const API_BASE_URL = 'https://reactnativekiatech-production.up.railway.app';
let authToken = localStorage.getItem('adminToken');

// Check API status on load
async function checkApiStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (data.status === 'OK') {
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

// Load user statistics
async function loadUserStats() {
    if (!authToken) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/stats/overview`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            const stats = result.data;
            
            // Update total users
            document.getElementById('total-users').textContent = stats.totalUsers;
            
            // Update subscription type counts
            let enterpriseCount = 0;
            let freeCount = 0;
            let premiumCount = 0;
            
            stats.subscriptionStats.forEach(stat => {
                if (stat._id === 'enterprise') enterpriseCount = stat.count;
                if (stat._id === 'free') freeCount = stat.count;
                if (stat._id === 'premium') premiumCount = stat.count;
            });
            
            document.getElementById('enterprise-users').textContent = enterpriseCount;
            document.getElementById('free-users').textContent = freeCount;
            
            // Update users list
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';
            
            stats.recentUsers.forEach(user => {
                const userElement = document.createElement('p');
                userElement.textContent = `• ${user.name} (${user.email}) - ${user.subscriptionType.charAt(0).toUpperCase() + user.subscriptionType.slice(1)}`;
                usersList.appendChild(userElement);
            });
            
        } else {
            console.error('Failed to load user stats:', response.status);
            // Set default values if API fails
            document.getElementById('total-users').textContent = 'Error';
            document.getElementById('enterprise-users').textContent = 'Error';
            document.getElementById('free-users').textContent = 'Error';
        }
    } catch (error) {
        console.error('Error loading user stats:', error);
        document.getElementById('total-users').textContent = 'Error';
        document.getElementById('enterprise-users').textContent = 'Error';
        document.getElementById('free-users').textContent = 'Error';
    }
}

// Show/hide user ID field based on target selection
document.getElementById('target').addEventListener('change', function() {
    const userIdGroup = document.getElementById('user-id-group');
    if (this.value === 'specific') {
        userIdGroup.style.display = 'block';
        document.getElementById('userId').required = true;
    } else {
        userIdGroup.style.display = 'none';
        document.getElementById('userId').required = false;
    }
});

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
            
            // Load user statistics after successful login
            await loadUserStats();
        } else {
            alert('Login failed: ' + result.message + '\n\nTry using:\nEmail: testadmin@kiatech.com\nPassword: test123\n\nOr create a new admin user.');
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
});

// Create admin functionality
document.getElementById('create-admin-btn').addEventListener('click', async function() {
    const email = prompt('Enter email for new admin user:');
    const password = prompt('Enter password for new admin user:');
    const name = prompt('Enter name for new admin user:');
    
    if (!email || !password || !name) {
        alert('All fields are required!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/create-admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Admin user created successfully!\n\nEmail: ' + email + '\nPassword: ' + password + '\n\nYou can now login with these credentials.');
            document.getElementById('login-email').value = email;
            document.getElementById('login-password').value = password;
        } else {
            alert('Failed to create admin user: ' + result.message);
        }
    } catch (error) {
        alert('Error creating admin user: ' + error.message);
    }
});

// Function to handle token expiration
function handleTokenExpiration() {
    authToken = null;
    localStorage.removeItem('adminToken');
    document.getElementById('auth-status').innerHTML = '❌ Token expired - Please login again';
    document.getElementById('auth-status').style.color = '#dc3545';
    document.getElementById('login-section').style.display = 'block';
    alert('Your session has expired. Please login again.');
}

// Function to check if token is expired
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        return true; // If we can't parse the token, consider it expired
    }
}

// Update notification sending to include auth token
document.getElementById('notification-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!authToken) {
        alert('Please login first!');
        return;
    }

    // Check if token is expired before making the request
    if (isTokenExpired(authToken)) {
        handleTokenExpiration();
        return;
    }
    
    const sendBtn = document.getElementById('send-btn');
    const status = document.getElementById('status');
    
    // Get form data
    const formData = new FormData(this);
    const notificationData = {
        title: formData.get('title'),
        message: formData.get('body'), // API expects 'message' not 'body'
        type: formData.get('priority') === 'urgent' ? 'error' : 
              formData.get('priority') === 'high' ? 'warning' : 'info'
    };

    // Add userId if specific target is selected
    if (formData.get('target') === 'specific') {
        notificationData.userId = formData.get('userId');
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
            status.textContent = `✅ Notification sent successfully! Message ID: ${result.data?.id || 'N/A'}`;
            
            // Update stats
            const totalNotifications = document.getElementById('total-notifications');
            totalNotifications.textContent = parseInt(totalNotifications.textContent) + 1;
            
            // Reset form
            this.reset();
            document.getElementById('user-id-group').style.display = 'none';
        } else {
            // Check if it's an authentication error
            if (response.status === 401) {
                handleTokenExpiration();
                return;
            }
            
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
    // Check if the stored token is expired
    if (isTokenExpired(authToken)) {
        handleTokenExpiration();
    } else {
        document.getElementById('auth-status').innerHTML = '✅ Logged in';
        document.getElementById('auth-status').style.color = '#28a745';
        document.getElementById('login-section').style.display = 'none';
        
        // Load user statistics
        loadUserStats();
    }
}

// Update stats periodically
setInterval(() => {
    checkApiStatus();
    if (authToken && !isTokenExpired(authToken)) {
        loadUserStats();
    }
}, 30000); // Check every 30 seconds