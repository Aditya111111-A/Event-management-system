// Default credentials from file patterns [file:1]
const credentials = {
    admin: { userid: 'Admin', password: 'Admin' },
    vendor: { userid: 'Vendor', password: 'Vendor' },
    user: { userid: 'User', password: 'User' }
};

// Sample data for persistence
let users = [{id:1, name:'User1', email:'user1@email.com', membership: '6 months'}];
let vendors = [{id:1, name:'Florist', email:'florist@email.com', membership: '6 months'}];
let products = [
    {id:1, name:'Product 1', price:100, vendor:1, image:'img1.jpg'},
    {id:2, name:'Product 2', price:150, vendor:2, image:'img2.jpg'}
];
let cart = [];

// Session management
function setSession(role, user) {
    localStorage.setItem('session', JSON.stringify({role, user, loggedIn: true}));
}

function getSession() {
    return JSON.parse(localStorage.getItem('session')) || null;
}

function logout() {
    localStorage.removeItem('session');
    window.location.href = 'index.html';
}

// Form handlers
document.addEventListener('DOMContentLoaded', function() {
    // Admin login
    const adminForm = document.getElementById('adminLoginForm');
    if (adminForm) {
        adminForm.onsubmit = function(e) {
            e.preventDefault();
            const userid = document.getElementById('adminUserId').value;
            const password = document.getElementById('adminPassword').value;
            if (userid === credentials.admin.userid && password === credentials.admin.password) {
                setSession('admin', {userid});
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Invalid credentials');
            }
        };
    }

    // Similar handlers for vendor-login.html, user-login.html
    const loginForms = document.querySelectorAll('form[id$="LoginForm"]');
    loginForms.forEach(form => {
        form.onsubmit = function(e) {
            e.preventDefault();
            const userid = form.querySelector('[id$="UserId"], [id$="userid"]').value;
            const password = form.querySelector('[id$="Password"], [id$="password"]').value;
            const role = form.closest('[id*="admin"]') ? 'admin' : 
                        form.closest('[id*="vendor"]') ? 'vendor' : 'user';
            
            if (userid === credentials[role].userid && password === credentials[role].password) {
                setSession(role, {userid});
                const dashboards = {
                    admin: 'admin-dashboard.html',
                    vendor: 'vendor-dashboard.html',
                    user: 'user-portal.html'
                };
                window.location.href = dashboards[role];
            } else {
                alert('Invalid credentials');
            }
        };
    });

    // Membership form validation (Add Membership)
    const membershipForms = document.querySelectorAll('form[id*="Membership"]');
    membershipForms.forEach(form => {
        form.onsubmit = function(e) {
            e.preventDefault();
            const required = form.querySelectorAll('[required]');
            let valid = true;
            required.forEach(field => {
                if (!field.value) valid = false;
            });
            const duration = document.querySelector('input[name="duration"]:checked');
            if (!duration && form.id.includes('Add')) valid = false;
            if (valid) {
                alert('Membership added successfully');
            } else {
                alert('All fields mandatory. Select duration (default: 6 months)');
            }
        };
    });

    // Cart functionality
    if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay();
    }

    // Role-based access check
    const session = getSession();
    if (window.location.pathname.includes('maintain') && session?.role !== 'admin') {
        alert('Access denied. Admin only.');
        logout();
    }
});

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push({...product, qty: 1});
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.querySelector('.grand-total') ? 
        document.querySelector('.grand-total').textContent = `Grand Total: ₹${total}` : null;
}

// Navigation helpers
function navigateVendor(vendorId) {
    window.location.href = `products.html?vendor=${vendorId}`;
}
