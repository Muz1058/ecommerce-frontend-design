// For Home.html and category.html - fetch and display products dynamically
document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector('.related-items-grid');
    if (grid) {
        fetch('https://api.example.com/products') // CHANGE to your product endpoint
            .then(res => res.json())
            .then(data => {
                grid.innerHTML = "";
                data.forEach(product => {
                    grid.innerHTML += `
                        <div class="item">
                            <div class="item-header">
                                ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ""}
                                <div class="item-actions">
                                    <button class="action-btn wishlist-btn" onclick="addToWishlist('${product.id}')">
                                        <img src="resourses/heart.svg" alt="wishlist">
                                    </button>
                                    <button class="action-btn view-btn" onclick="location.href='product details.html?id=${product.id}'">
                                        <img src="resourses/view.svg" alt="view">
                                    </button>
                                </div>
                                <img src="${product.image}" alt="${product.name}">
                                <button class="add-to-cart" onclick="addToCart('${product.id}')">Add To Cart</button>
                            </div>
                            <div class="item-info">
                                <div class="item-name">${product.name}</div>
                                <div class="item-price">
                                    <span class="current-price">$${product.price}</span>
                                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ""}
                                </div>
                                <div class="item-rating">
                                    <div class="stars">${"★".repeat(Math.round(product.rating || 5))}</div>
                                    <span class="rating-text">(${product.ratingCount || 0})</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
            });
    }
});

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    let found = cart.find(i => i.id == productId);
    if (found) found.qty += 1;
    else cart.push({ id: productId, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Added to cart!");
}

function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) wishlist.push(productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert("Added to wishlist!");
}