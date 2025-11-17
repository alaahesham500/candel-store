document.addEventListener('DOMContentLoaded', () => {
    // ==================== Sign In Animation ====================
    const signInBtn = document.querySelector('.header-links .sign-in-btn');
    if (signInBtn) {
        signInBtn.addEventListener('click', () => {
            signInBtn.classList.add('animate-press');
            setTimeout(() => signInBtn.classList.remove('animate-press'), 500);
        });
    }

    // ==================== Back to Top ====================
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        const toggleBackToTop = () => backToTopBtn.classList.toggle('show', window.scrollY > 300);
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ==================== Theme Toggle ====================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ==================== Cart Functionality ====================
    const cartCount = document.querySelector(".cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const updateCartCount = () => {
        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };
    updateCartCount();

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) existingItem.quantity += 1;
            else cart.push({ name, price, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            showToast(`✅ تم إضافة ${name} إلى السلة`, "success");
        });
    });

    // ==================== Wishlist Feature ====================
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    const wishlistPanel = document.getElementById('wishlist-panel');
    const openWishlist = document.getElementById('open-wishlist');
    const closeWishlist = document.getElementById('close-wishlist');
    const clearWishlistBtn = document.getElementById('clear-wishlist');
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const wishlistCount = document.querySelector('.wishlist-count');

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // تحديث عداد المفضلة
    function updateWishlistCount() {
        if (wishlistCount) wishlistCount.textContent = wishlist.length;
    }

    // عرض المفضلات في النافذة
    function renderWishlist() {
        wishlistItemsContainer.innerHTML = '';
        wishlist.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('wishlist-item');
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <div>
                    <button class="add-to-cart-small" data-name="${item.name}" data-price="${item.price}">🛒 أضف للسلة</button>
                    <button data-id="${item.id}" class="remove-wishlist">❌</button>
                </div>
            `;
            wishlistItemsContainer.appendChild(div);
        });
        updateWishlistCount();
    }

    // حفظ التغييرات في Local Storage
    function saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        renderWishlist();
    }

    // عند الضغط على القلب
    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const card = icon.closest('.card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const image = card.dataset.image;
            const price = card.dataset.price;

            const existing = wishlist.find(item => item.id === id);
            if (existing) {
                wishlist = wishlist.filter(item => item.id !== id);
                icon.classList.remove('active');
                showToast(`❌ تم حذف ${name} من المفضلة`, "error");
            } else {
                wishlist.push({ id, name, image, price });
                icon.classList.add('active');
                showToast(`💖 تمت إضافة ${name} إلى المفضلة`, "favorite");
            }
            saveWishlist();
        });
    });

    // فتح / غلق المفضلة
    if (openWishlist) {
        openWishlist.addEventListener('click', () => wishlistPanel.classList.add('open'));
    }
    if (closeWishlist) {
        closeWishlist.addEventListener('click', () => wishlistPanel.classList.remove('open'));
    }

    // حذف منتج من المفضلة
    wishlistItemsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-wishlist')) {
            const id = e.target.dataset.id;
            wishlist = wishlist.filter(item => item.id !== id);
            saveWishlist();
            showToast(`❌ تم حذف المنتج من المفضلة`, "error");
        }

        // زر "أضف للسلة"
        if (e.target.classList.contains('add-to-cart-small')) {
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) existingItem.quantity += 1;
            else cart.push({ name, price, quantity: 1 });
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            showToast(`✅ تم إضافة ${name} إلى السلة`, "success");
        }
    });

    // زر حذف الكل
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', () => {
            wishlist = [];
            saveWishlist();
            showToast(`🗑️ تم حذف جميع المفضلات`, "error");
        });
    }

    // ===== Toast Notification Function (ملوّنة) =====
    function showToast(message, type = "success") {
        const toast = document.getElementById('toast');
        toast.textContent = message;

        toast.className = "toast";
        toast.classList.add('show');

        if (type === "success") toast.classList.add("success");
        else if (type === "favorite") toast.classList.add("favorite");
        else if (type === "error") toast.classList.add("error");

        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // تحميل المفضلات عند فتح الصفحة
    renderWishlist();
});

document.addEventListener('DOMContentLoaded', () => {

    // ==================== Cart & Wishlist ====================
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const cartCount = document.querySelector(".cart-count");
    const wishlistCount = document.querySelector(".wishlist-count");

    function updateCounts() {
        cartCount.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        wishlistCount.textContent = wishlist.length;
    }

    updateCounts();

    // Add to Cart
    document.querySelectorAll(".add-to-cart, .add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".product-card, .card");
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) existingItem.quantity = (existingItem.quantity || 1) + 1;
            else cart.push({name, price, quantity: 1});
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCounts();
            showToast(`✅ تم إضافة ${name} إلى السلة`, "success");
        });
    });

    // Add to Wishlist
    document.querySelectorAll(".add-to-wishlist, .wishlist-icon").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".product-card, .card");
            const id = card.dataset.id || card.dataset.name;
            const name = card.dataset.name;
            const price = card.dataset.price;
            const image = card.dataset.image || card.querySelector('img').src;

            const existing = wishlist.find(item => item.id === id);
            if (existing) {
                wishlist = wishlist.filter(item => item.id !== id);
                btn.classList.remove('active');
                showToast(`❌ تم حذف ${name} من المفضلة`, "error");
            } else {
                wishlist.push({id, name, price, image});
                btn.classList.add('active');
                showToast(`💖 تمت إضافة ${name} إلى المفضلة`, "favorite");
            }
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            updateCounts();
            renderWishlist();
        });
    });

    // ==================== Wishlist Panel ====================
    const wishlistPanel = document.getElementById('wishlist-panel');
    const openWishlist = document.getElementById('open-wishlist');
    const closeWishlist = document.getElementById('close-wishlist');
    const clearWishlistBtn = document.getElementById('clear-wishlist');
    const wishlistItemsContainer = document.getElementById('wishlist-items');

    function renderWishlist() {
        if (!wishlistItemsContainer) return;
        wishlistItemsContainer.innerHTML = '';
        wishlist.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('wishlist-item');
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span>${item.name}</span>
                <div>
                    <button class="add-to-cart-small" data-name="${item.name}" data-price="${item.price}">🛒 أضف للسلة</button>
                    <button data-id="${item.id}" class="remove-wishlist">❌</button>
                </div>
            `;
            wishlistItemsContainer.appendChild(div);
        });
    }

    if (openWishlist) openWishlist.addEventListener('click', () => wishlistPanel.classList.add('open'));
    if (closeWishlist) closeWishlist.addEventListener('click', () => wishlistPanel.classList.remove('open'));
    if (clearWishlistBtn) clearWishlistBtn.addEventListener('click', () => {
        wishlist = [];
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        renderWishlist();
        updateCounts();
    });

    wishlistItemsContainer?.addEventListener('click', e => {
        if (e.target.classList.contains('remove-wishlist')) {
            const id = e.target.dataset.id;
            wishlist = wishlist.filter(item => item.id !== id);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderWishlist();
            updateCounts();
        }
        if (e.target.classList.contains('add-to-cart-small')) {
            const name = e.target.dataset.name;
            const price = parseFloat(e.target.dataset.price);
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) existingItem.quantity += 1;
            else cart.push({name, price, quantity: 1});
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCounts();
        }
    });

    renderWishlist();

    // ==================== Filter & Sort ====================
    const filterCategory = document.getElementById('filterCategory');
    const sortPrice = document.getElementById('sortPrice');
    const searchInput = document.getElementById('searchInput');
    const products = document.querySelectorAll('.product-card');

    function filterAndSortProducts() {
        const category = filterCategory.value.toLowerCase();
        const search = searchInput.value.toLowerCase();
        const sort = sortPrice.value;

        let productsArray = Array.from(products);

        // Highlight instead of hide
        productsArray.forEach(prod => {
            const name = prod.querySelector('h3').textContent.toLowerCase();
            const matchesCategory = category === 'all' || name.includes(category);
            const matchesSearch = name.includes(search);

            if (matchesCategory && matchesSearch) {
                prod.style.opacity = "1";
                prod.style.transform = "scale(1.03)";
            } else {
                prod.style.opacity = "0.5";
                prod.style.transform = "scale(1)";
            }
        });

        // Sort by price
        productsArray.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').textContent.replace('$',''));
            const priceB = parseFloat(b.querySelector('p').textContent.replace('$',''));
            if (sort === 'low') return priceA - priceB;
            if (sort === 'high') return priceB - priceA;
            return 0;
        });

        const container = document.querySelector('.products-grid');
        productsArray.forEach(prod => container.appendChild(prod));
    }

    filterCategory?.addEventListener('change', filterAndSortProducts);
    sortPrice?.addEventListener('change', filterAndSortProducts);
    searchInput?.addEventListener('input', filterAndSortProducts);

    // ==================== Toast ====================
    function showToast(message, type="success") {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

});
