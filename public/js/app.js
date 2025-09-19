class FoodOrderingApp {
    constructor() {
        this.currentUser = null;
        this.menu = {};
        this.cart = {};
        this.orders = {};
        
        this.init();
    }
    
    async init() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const deliveryDateInput = document.getElementById('deliveryDate');
        if (deliveryDateInput) {
            deliveryDateInput.min = today;
        }
        
        await this.checkSession();
        await this.loadMenu();
        await this.loadContactInfo();
        this.setupEventListeners();
        this.updateUI();
        
        if (this.currentUser) {
            await this.loadUserOrders();
        }
    }
    
    async checkSession() {
        try {
            const response = await fetch('/api/session');
            const data = await response.json();
            
            if (data.loggedIn) {
                this.currentUser = data.user;
            }
        } catch (error) {
            console.error('Error checking session:', error);
        }
    }
    
    async loadMenu() {
        try {
            const response = await fetch('/api/menu');
            this.menu = await response.json();
            this.displayMenu();
        } catch (error) {
            console.error('Error loading menu:', error);
        }
    }
    
    async loadContactInfo() {
        try {
            const response = await fetch('/api/contact');
            const contact = await response.json();
            
            document.getElementById('contactPhone').textContent = contact.phone;
            document.getElementById('contactEmail').textContent = contact.email;
            document.getElementById('contactAddress').textContent = contact.address;
        } catch (error) {
            console.error('Error loading contact info:', error);
        }
    }
    
    async loadUserOrders() {
        try {
            const response = await fetch('/api/orders');
            this.orders = await response.json();
            
            if (this.currentUser.role === 'user') {
                this.displayUserOrders();
            } else {
                this.displayAdminOrders();
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }
    
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.logout.bind(this));
        }
        
        // Order form
        const orderForm = document.getElementById('orderFormElement');
        if (orderForm) {
            orderForm.addEventListener('submit', this.submitOrder.bind(this));
        }
        
        // Cancel order button
        const cancelOrderBtn = document.getElementById('cancelOrder');
        if (cancelOrderBtn) {
            cancelOrderBtn.addEventListener('click', this.cancelOrder.bind(this));
        }
        
        // Admin menu form
        const addMenuItemForm = document.getElementById('addMenuItemForm');
        if (addMenuItemForm) {
            addMenuItemForm.addEventListener('submit', this.addMenuItem.bind(this));
        }
        
        // Admin tabs
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
    }
    
    updateUI() {
        const userMenu = document.getElementById('userMenu');
        const authLinks = document.getElementById('authLinks');
        const welcomeUser = document.getElementById('welcomeUser');
        const orderForm = document.getElementById('orderForm');
        const userOrders = document.getElementById('userOrders');
        const adminPanel = document.getElementById('adminPanel');
        
        if (this.currentUser) {
            userMenu.style.display = 'flex';
            authLinks.style.display = 'none';
            welcomeUser.textContent = `Witaj, ${this.currentUser.fullName}`;
            
            if (this.currentUser.role === 'admin') {
                adminPanel.style.display = 'block';
            } else {
                userOrders.style.display = 'block';
            }
        } else {
            userMenu.style.display = 'none';
            authLinks.style.display = 'flex';
            orderForm.style.display = 'none';
            userOrders.style.display = 'none';
            adminPanel.style.display = 'none';
        }
    }
    
    displayMenu() {
        const menuContainer = document.getElementById('menuContainer');
        if (!menuContainer || !this.menu.categories) return;
        
        menuContainer.innerHTML = '';
        
        Object.keys(this.menu.categories).forEach(categoryKey => {
            const category = this.menu.categories[categoryKey];
            
            if (Object.keys(category.items).length === 0) return;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'menu-category';
            
            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category.name;
            categoryDiv.appendChild(categoryTitle);
            
            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'menu-items';
            
            Object.values(category.items).forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'menu-item';
                itemDiv.dataset.itemId = item.id;
                
                itemDiv.innerHTML = `
                    <h5>${item.name}</h5>
                    <p class="description">${item.description || ''}</p>
                    <p class="price">${parseFloat(item.price).toFixed(2)} zł</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <span class="quantity-display">0</span>
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                `;
                
                // Only add event listeners for logged-in users
                if (this.currentUser && this.currentUser.role !== 'admin') {
                    itemDiv.addEventListener('click', (e) => {
                        if (!e.target.classList.contains('quantity-btn')) {
                            this.toggleMenuItem(item.id);
                        }
                    });
                    
                    const quantityBtns = itemDiv.querySelectorAll('.quantity-btn');
                    quantityBtns.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.updateQuantity(item.id, e.target.dataset.action);
                        });
                    });
                }
                
                itemsGrid.appendChild(itemDiv);
            });
            
            categoryDiv.appendChild(itemsGrid);
            menuContainer.appendChild(categoryDiv);
        });
    }
    
    toggleMenuItem(itemId) {
        if (!this.cart[itemId]) {
            this.cart[itemId] = { quantity: 1 };
        } else if (this.cart[itemId].quantity === 0) {
            this.cart[itemId].quantity = 1;
        }
        
        this.updateMenuDisplay();
        this.updateCartSummary();
    }
    
    updateQuantity(itemId, action) {
        if (!this.cart[itemId]) {
            this.cart[itemId] = { quantity: 0 };
        }
        
        if (action === 'increase') {
            this.cart[itemId].quantity++;
        } else if (action === 'decrease' && this.cart[itemId].quantity > 0) {
            this.cart[itemId].quantity--;
        }
        
        if (this.cart[itemId].quantity === 0) {
            delete this.cart[itemId];
        }
        
        this.updateMenuDisplay();
        this.updateCartSummary();
    }
    
    updateMenuDisplay() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(itemDiv => {
            const itemId = itemDiv.dataset.itemId;
            const quantityDisplay = itemDiv.querySelector('.quantity-display');
            
            if (this.cart[itemId] && this.cart[itemId].quantity > 0) {
                itemDiv.classList.add('selected');
                quantityDisplay.textContent = this.cart[itemId].quantity;
            } else {
                itemDiv.classList.remove('selected');
                quantityDisplay.textContent = '0';
            }
        });
        
        // Show/hide order form based on cart contents
        const hasItems = Object.keys(this.cart).length > 0;
        const orderForm = document.getElementById('orderForm');
        if (orderForm && this.currentUser && this.currentUser.role !== 'admin') {
            orderForm.style.display = hasItems ? 'block' : 'none';
        }
    }
    
    updateCartSummary() {
        const orderSummary = document.getElementById('orderSummary');
        const totalAmount = document.getElementById('totalAmount');
        
        if (!orderSummary || !totalAmount) return;
        
        orderSummary.innerHTML = '';
        let total = 0;
        
        Object.keys(this.cart).forEach(itemId => {
            const item = this.findMenuItem(itemId);
            if (!item) return;
            
            const quantity = this.cart[itemId].quantity;
            const price = parseFloat(item.price);
            const subtotal = quantity * price;
            total += subtotal;
            
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <span>${item.name} × ${quantity}</span>
                <span>${subtotal.toFixed(2)} zł</span>
            `;
            orderSummary.appendChild(summaryItem);
        });
        
        totalAmount.textContent = total.toFixed(2);
    }
    
    findMenuItem(itemId) {
        for (const category of Object.values(this.menu.categories)) {
            if (category.items[itemId]) {
                return category.items[itemId];
            }
        }
        return null;
    }
    
    async submitOrder(e) {
        e.preventDefault();
        
        if (Object.keys(this.cart).length === 0) {
            alert('Wybierz przynajmniej jedną pozycję z menu');
            return;
        }
        
        const formData = new FormData(e.target);
        const orderData = {
            items: this.cart,
            deliveryDate: formData.get('deliveryDate'),
            deliveryTime: formData.get('deliveryTime'),
            deliveryAddress: formData.get('deliveryAddress'),
            notes: formData.get('notes') || ''
        };
        
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Zamówienie zostało złożone!');
                this.cart = {};
                e.target.reset();
                this.updateMenuDisplay();
                this.updateCartSummary();
                await this.loadUserOrders();
            } else {
                alert('Błąd podczas składania zamówienia');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Wystąpił błąd podczas składania zamówienia');
        }
    }
    
    cancelOrder() {
        this.cart = {};
        this.updateMenuDisplay();
        this.updateCartSummary();
        document.getElementById('orderFormElement').reset();
    }
    
    displayUserOrders() {
        const ordersContainer = document.getElementById('ordersContainer');
        if (!ordersContainer) return;
        
        ordersContainer.innerHTML = '';
        
        const orderIds = Object.keys(this.orders).sort((a, b) => {
            return new Date(this.orders[b].createdAt) - new Date(this.orders[a].createdAt);
        });
        
        if (orderIds.length === 0) {
            ordersContainer.innerHTML = '<p>Nie masz jeszcze żadnych zamówień.</p>';
            return;
        }
        
        orderIds.forEach(orderId => {
            const order = this.orders[orderId];
            const orderCard = this.createOrderCard(order);
            ordersContainer.appendChild(orderCard);
        });
    }
    
    displayAdminOrders() {
        const adminOrdersContainer = document.getElementById('adminOrdersContainer');
        if (!adminOrdersContainer) return;
        
        adminOrdersContainer.innerHTML = '';
        
        const orderIds = Object.keys(this.orders).sort((a, b) => {
            return new Date(this.orders[b].createdAt) - new Date(this.orders[a].createdAt);
        });
        
        if (orderIds.length === 0) {
            adminOrdersContainer.innerHTML = '<p>Brak zamówień.</p>';
            return;
        }
        
        orderIds.forEach(orderId => {
            const order = this.orders[orderId];
            const orderCard = this.createOrderCard(order, true);
            adminOrdersContainer.appendChild(orderCard);
        });
    }
    
    createOrderCard(order, isAdmin = false) {
        const orderCard = document.createElement('div');
        orderCard.className = `order-card ${order.status}`;
        
        const statusText = {
            pending: 'Oczekuje',
            accepted: 'Przyjęte',
            rejected: 'Odrzucone'
        };
        
        let itemsHtml = '';
        Object.keys(order.items).forEach(itemId => {
            const item = this.findMenuItem(itemId);
            if (item) {
                const quantity = order.items[itemId].quantity;
                const price = parseFloat(item.price);
                const subtotal = quantity * price;
                itemsHtml += `<div class="summary-item">
                    <span>${item.name} × ${quantity}</span>
                    <span>${subtotal.toFixed(2)} zł</span>
                </div>`;
            }
        });
        
        let total = 0;
        Object.keys(order.items).forEach(itemId => {
            const item = this.findMenuItem(itemId);
            if (item) {
                total += order.items[itemId].quantity * parseFloat(item.price);
            }
        });
        
        orderCard.innerHTML = `
            <div class="order-header">
                <h4>Zamówienie #${order.id.substring(0, 8)}</h4>
                <span class="order-status ${order.status}">${statusText[order.status]}</span>
            </div>
            <div class="order-details">
                ${isAdmin ? `<p><strong>Klient:</strong> ${order.userFullName}</p>` : ''}
                <p><strong>Data dostawy:</strong> ${order.deliveryDate} o ${order.deliveryTime}</p>
                <p><strong>Adres:</strong> ${order.deliveryAddress}</p>
                ${order.notes ? `<p><strong>Uwagi:</strong> ${order.notes}</p>` : ''}
                <p><strong>Data zamówienia:</strong> ${new Date(order.createdAt).toLocaleString('pl-PL')}</p>
            </div>
            <div class="order-items">
                <h5>Pozycje:</h5>
                ${itemsHtml}
                <div class="total">
                    <strong>Razem: ${total.toFixed(2)} zł</strong>
                </div>
            </div>
            ${isAdmin && order.status === 'pending' ? `
                <div class="admin-order-actions">
                    <button class="btn btn-success" onclick="app.updateOrderStatus('${order.id}', 'accepted')">
                        Przyjmij zamówienie
                    </button>
                    <button class="btn btn-danger" onclick="app.updateOrderStatus('${order.id}', 'rejected')">
                        Odrzuć zamówienie
                    </button>
                </div>
            ` : ''}
        `;
        
        return orderCard;
    }
    
    async updateOrderStatus(orderId, status) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            
            const result = await response.json();
            
            if (result.success) {
                await this.loadUserOrders();
            } else {
                alert('Błąd podczas aktualizacji zamówienia');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Wystąpił błąd podczas aktualizacji zamówienia');
        }
    }
    
    async addMenuItem(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const menuItem = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price'))
        };
        
        const category = formData.get('category');
        
        try {
            const response = await fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category, item: menuItem })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Pozycja została dodana do menu');
                e.target.reset();
                await this.loadMenu();
                this.displayCurrentMenu();
            } else {
                alert('Błąd podczas dodawania pozycji');
            }
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Wystąpił błąd podczas dodawania pozycji');
        }
    }
    
    displayCurrentMenu() {
        const currentMenuDiv = document.getElementById('currentMenu');
        if (!currentMenuDiv) return;
        
        currentMenuDiv.innerHTML = '<h5>Aktualne menu:</h5>';
        
        Object.keys(this.menu.categories).forEach(categoryKey => {
            const category = this.menu.categories[categoryKey];
            
            if (Object.keys(category.items).length === 0) return;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.innerHTML = `<h6>${category.name}</h6>`;
            
            Object.values(category.items).forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'summary-item';
                itemDiv.innerHTML = `
                    <span>${item.name} - ${item.description || 'Brak opisu'}</span>
                    <span>${parseFloat(item.price).toFixed(2)} zł</span>
                `;
                categoryDiv.appendChild(itemDiv);
            });
            
            currentMenuDiv.appendChild(categoryDiv);
        });
    }
    
    switchTab(tabName) {
        // Update tab buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Load content for specific tabs
        if (tabName === 'menu') {
            this.displayCurrentMenu();
        }
    }
    
    async logout() {
        try {
            await fetch('/api/logout', { method: 'POST' });
            this.currentUser = null;
            this.cart = {};
            this.orders = {};
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FoodOrderingApp();
});