// script.js
let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: "Wireless Headphones", price: 89.99, image: "https://picsum.photos/id/201/400/400" },
    { id: 2, name: "Smart Watch", price: 129.99, image: "https://picsum.photos/id/180/400/400" },
    { id: 3, name: "Leather Backpack", price: 79.99, image: "https://picsum.photos/id/251/400/400" },
];

let cart = [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentEditId = null;

// === ADMIN PASSWORD ===
const ADMIN_PASSWORD = "WEBSITE786";   // ← Yeh change kar diya

// Render Products in Shop
function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    products.forEach(product => {
        grid.innerHTML += `
            <div class="product-card bg-white rounded-3xl overflow-hidden shadow">
                <img src="${product.image}" class="w-full h-52 object-cover">
                <div class="p-5">
                    <h3 class="font-semibold text-lg">${product.name}</h3>
                    <p class="text-2xl font-bold text-indigo-600">\[ {product.price}</p>
                    <button onclick="addToCart(${product.id})" class="mt-4 w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800">Add to Cart</button>
                </div>
            </div>
        `;
    });
}

// Add to Cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Toggle Cart
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    const itemsDiv = document.getElementById('cart-items');
    let total = 0;

    itemsDiv.innerHTML = '';
    cart.forEach((item, index) => {
        total += item.price;
        itemsDiv.innerHTML += `
            <div class="flex justify-between items-center mb-4">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p class="text-sm text-gray-500"> \]{item.price}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700">Remove</button>
            </div>
        `;
    });

    document.getElementById('cart-total').textContent = `\[ {total.toFixed(2)}`;
    modal.classList.toggle('hidden');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    toggleCart();
    updateCartCount();
}

// Checkout
function checkout() {
    if (cart.length === 0) return;
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };
    
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert("✅ Order placed successfully! Check Admin Panel.");
    cart = [];
    updateCartCount();
    toggleCart();
    renderOrders();
}

// Admin Login
function showAdminLogin() {
    document.getElementById('admin-login').classList.remove('hidden');
    document.getElementById('admin-pass').value = ''; // Clear previous input
}

function loginAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === ADMIN_PASSWORD) {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        document.getElementById('home').classList.add('hidden');
        document.getElementById('shop').classList.add('hidden');
        renderAdminProducts();
        renderOrders();
    } else {
        alert("❌ Wrong Password!");
    }
}

function logoutAdmin() {
    document.getElementById('admin-panel').classList.add('hidden');
    showSection('home');
}

// Switch Tabs in Admin
function switchAdminTab(tab) {
    document.querySelectorAll('.admin-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.admin-tab').forEach(el => el.classList.remove('bg-indigo-600', 'text-white'));
    
    if (tab === 0) {
        document.getElementById('admin-products').classList.remove('hidden');
        document.querySelectorAll('.admin-tab')[0].classList.add('bg-indigo-600', 'text-white');
    } else {
        document.getElementById('admin-orders').classList.remove('hidden');
        document.querySelectorAll('.admin-tab')[1].classList.add('bg-indigo-600', 'text-white');
    }
}

// Render Admin Products
function renderAdminProducts() {
    const container = document.getElementById('admin-product-list');
    container.innerHTML = '';
    products.forEach(product => {
        container.innerHTML += `
            <div class="bg-white p-6 rounded-3xl shadow">
                <img src="${product.image}" class="w-full h-48 object-cover rounded-2xl mb-4">
                <h3 class="font-semibold">${product.name}</h3>
                <p class="text-xl font-bold text-indigo-600"> \]{product.price}</p>
                <div class="flex gap-3 mt-4">
                    <button onclick="editProduct(${product.id})" class="flex-1 bg-yellow-500 text-white py-3 rounded-2xl">Edit</button>
                    <button onclick="deleteProduct(${product.id})" class="flex-1 bg-red-500 text-white py-3 rounded-2xl">Delete</button>
                </div>
            </div>
        `;
    });
}

// Add/Edit Product
function showAddProductModal() {
    currentEditId = null;
    document.getElementById('modal-title').textContent = "Add New Product";
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-image').value = '';
    document.getElementById('product-modal').classList.remove('hidden');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    currentEditId = id;
    document.getElementById('modal-title').textContent = "Edit Product";
    document.getElementById('prod-name').value = product.name;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-image').value = product.image;
    document.getElementById('product-modal').classList.remove('hidden');
}

function saveProduct() {
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    let image = document.getElementById('prod-image').value || "https://picsum.photos/id/201/400/400";

    if (!name || !price) {
        alert("Name and Price are required!");
        return;
    }

    if (currentEditId) {
        const product = products.find(p => p.id === currentEditId);
        product.name = name;
        product.price = price;
        product.image = image;
    } else {
        products.push({
            id: Date.now(),
            name: name,
            price: price,
            image: image
        });
    }

    localStorage.setItem('products', JSON.stringify(products));
    closeProductModal();
    renderProducts();
    renderAdminProducts();
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        renderAdminProducts();
    }
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Render Orders
function renderOrders() {
    const container = document.getElementById('admin-order-list');
    container.innerHTML = '';
    orders.forEach(order => {
        container.innerHTML += `
            <div class="bg-white p-6 rounded-3xl shadow">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-lg">Order #${order.id}</p>
                        <p class="text-sm text-gray-500">${order.date}</p>
                    </div>
                    <p class="font-bold text-xl text-green-600">$${order.total.toFixed(2)}</p>
                </div>
                <p class="text-sm mt-2">${order.items.length} items</p>
            </div>
        `;
    });
}

function showSection(section) {
    document.getElementById('home').classList.add('hidden');
    document.getElementById('shop').classList.add('hidden');
    document.getElementById(section).classList.remove('hidden');
}

// Initialize
renderProducts();
showSection('home');