const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'nep-gappa-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initialize data files if they don't exist
function initializeDataFiles() {
    // Initialize users with default admin
    if (!fs.existsSync(USERS_FILE)) {
        const defaultUsers = {
            admin: {
                id: 'admin',
                username: 'admin',
                password: bcrypt.hashSync('admin123', 10),
                role: 'admin',
                fullName: 'Administrator',
                phone: '+48 123 456 789',
                email: 'admin@nep-gappa.pl'
            }
        };
        fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    }

    // Initialize empty menu
    if (!fs.existsSync(MENU_FILE)) {
        const defaultMenu = {
            categories: {
                main: { name: "Dania główne", items: {} },
                appetizers: { name: "Przystawki", items: {} },
                desserts: { name: "Desery", items: {} },
                drinks: { name: "Napoje", items: {} }
            }
        };
        fs.writeFileSync(MENU_FILE, JSON.stringify(defaultMenu, null, 2));
    }

    // Initialize empty orders
    if (!fs.existsSync(ORDERS_FILE)) {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify({}, null, 2));
    }
}

initializeDataFiles();

// Helper functions
function loadData(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        return {};
    }
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

function requireAdmin(req, res, next) {
    if (req.session.userId && req.session.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Brak uprawnień administratora' });
    }
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Authentication routes
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadData(USERS_FILE);
    
    const user = users[username];
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        req.session.fullName = user.fullName;
        
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                fullName: user.fullName
            }
        });
    } else {
        res.status(401).json({ error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, password, fullName, phone } = req.body;
    const users = loadData(USERS_FILE);
    
    if (users[username]) {
        return res.status(400).json({ error: 'Użytkownik już istnieje' });
    }
    
    const userId = uuidv4();
    users[username] = {
        id: userId,
        username,
        password: bcrypt.hashSync(password, 10),
        role: 'user',
        fullName,
        phone,
        registeredAt: new Date().toISOString()
    };
    
    saveData(USERS_FILE, users);
    
    res.json({ success: true, message: 'Konto zostało utworzone' });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Menu routes
app.get('/api/menu', (req, res) => {
    const menu = loadData(MENU_FILE);
    res.json(menu);
});

app.post('/api/menu', requireAdmin, (req, res) => {
    const { category, item } = req.body;
    const menu = loadData(MENU_FILE);
    
    if (!menu.categories[category]) {
        return res.status(400).json({ error: 'Nieprawidłowa kategoria' });
    }
    
    const itemId = uuidv4();
    menu.categories[category].items[itemId] = {
        id: itemId,
        ...item,
        createdAt: new Date().toISOString()
    };
    
    saveData(MENU_FILE, menu);
    res.json({ success: true, itemId });
});

// Orders routes
app.get('/api/orders', requireAuth, (req, res) => {
    const orders = loadData(ORDERS_FILE);
    
    if (req.session.role === 'admin') {
        res.json(orders);
    } else {
        const userOrders = {};
        Object.keys(orders).forEach(orderId => {
            if (orders[orderId].userId === req.session.userId) {
                userOrders[orderId] = orders[orderId];
            }
        });
        res.json(userOrders);
    }
});

app.post('/api/orders', requireAuth, (req, res) => {
    const { items, deliveryDate, deliveryTime, deliveryAddress, notes } = req.body;
    const orders = loadData(ORDERS_FILE);
    
    const orderId = uuidv4();
    orders[orderId] = {
        id: orderId,
        userId: req.session.userId,
        userFullName: req.session.fullName,
        items,
        deliveryDate,
        deliveryTime,
        deliveryAddress,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    saveData(ORDERS_FILE, orders);
    res.json({ success: true, orderId });
});

app.patch('/api/orders/:orderId', requireAdmin, (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = loadData(ORDERS_FILE);
    
    if (!orders[orderId]) {
        return res.status(404).json({ error: 'Zamówienie nie zostało znalezione' });
    }
    
    orders[orderId].status = status;
    orders[orderId].updatedAt = new Date().toISOString();
    
    saveData(ORDERS_FILE, orders);
    res.json({ success: true });
});

// User session info
app.get('/api/session', (req, res) => {
    if (req.session.userId) {
        res.json({
            loggedIn: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                role: req.session.role,
                fullName: req.session.fullName
            }
        });
    } else {
        res.json({ loggedIn: false });
    }
});

// Contact info
app.get('/api/contact', (req, res) => {
    res.json({
        phone: '+48 123 456 789',
        email: 'kontakt@nep-gappa.pl',
        address: 'ul. Przykładowa 123, 00-000 Warszawa'
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
    console.log(`Otwórz http://localhost:${PORT} w przeglądarce`);
    console.log('Domyślne konto administratora: admin / admin123');
});