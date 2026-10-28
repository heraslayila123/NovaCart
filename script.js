
const products = [
  {
    id: 1,
    name: "Minimal Headphones",
    category: "Technology",
    price: 1499,
    icon: "🎧"
  },
  {
    id: 2,
    name: "Everyday Backpack",
    category: "Accessories",
    price: 999,
    icon: "🎒"
  },
  {
    id: 3,
    name: "Classic Wristwatch",
    category: "Lifestyle",
    price: 1299,
    icon: "⌚"
  },
  {
    id: 4,
    name: "Ceramic Coffee Mug",
    category: "Home essentials",
    price: 399,
    icon: "☕"
  },
  {
    id: 5,
    name: "Running Sneakers",
    category: "Footwear",
    price: 1799,
    icon: "👟"
  },
  {
    id: 6,
    name: "Smart Desk Lamp",
    category: "Home essentials",
    price: 799,
    icon: "💡"
  },
  {
    id: 7,
    name: "Travel Water Bottle",
    category: "Accessories",
    price: 499,
    icon: "🧴"
  },
  {
    id: 8,
    name: "Wireless Speaker",
    category: "Technology",
    price: 1199,
    icon: "🔊"
  }
];

const cart = new Map();

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutModal = document.getElementById("checkoutModal");
const toast = document.getElementById("toast");

const formatPrice = amount =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Render product cards dynamically from JavaScript objects.
function renderProducts() {
  productGrid.replaceChildren();

  document.getElementById("productCount").textContent =
    `${products.length} products`;

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const art = document.createElement("div");
    art.className = "product-art";
    art.textContent = product.icon;
    art.setAttribute("aria-hidden", "true");

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "add-button";
    button.textContent = "Add to cart +";
    button.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, button);
    info.append(category, name, bottom);
    card.append(art, info);
    productGrid.appendChild(card);
  });
}

// Add one item or increase its quantity.
function addToCart(productId) {
  const currentQuantity = cart.get(productId) || 0;
  cart.set(productId, currentQuantity + 1);

  renderCart();
  showToast("Item added to your cart!");
}

// Increase or decrease the selected product quantity.
function changeQuantity(productId, change) {
  const quantity = cart.get(productId) || 0;
  const updatedQuantity = quantity + change;

  if (updatedQuantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, updatedQuantity);
  }

  renderCart();
}

// Calculate total number of items and subtotal.
function getCartSummary() {
  let count = 0;
  let total = 0;

  cart.forEach((quantity, productId) => {
    const product = products.find(item => item.id === productId);

    if (product) {
      count += quantity;
      total += product.price * quantity;
    }
  });

  return { count, total };
}

// Render the shopping cart and update all totals.
function renderCart() {
  cartItems.replaceChildren();

  const { count, total } = getCartSummary();

  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);

  if (cart.size === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent =
      "Your cart is empty. Add something you love!";
    cartItems.appendChild(empty);
    return;
  }

  cart.forEach((quantity, productId) => {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-row";

    const art = document.createElement("div");
    art.className = "cart-art";
    art.textContent = product.icon;
    art.setAttribute("aria-hidden", "true");

    const detail = document.createElement("div");
    detail.className = "cart-detail";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "muted";
    price.textContent = formatPrice(product.price * quantity);

    detail.append(name, price);

    const controls = document.createElement("div");
    controls.className = "quantity";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Decrease ${product.name}`);
    minus.addEventListener("click", () =>
      changeQuantity(productId, -1)
    );

    const amount = document.createElement("span");
    amount.textContent = quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Increase ${product.name}`);
    plus.addEventListener("click", () =>
      changeQuantity(productId, 1)
    );

    controls.append(minus, amount, plus);

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${product.name}`);
    remove.addEventListener("click", () => {
      cart.delete(productId);
      renderCart();
      showToast("Item removed.");
    });

    row.append(art, detail, controls, remove);
    cartItems.appendChild(row);
  });
}

// Show a modal preview of the order.
function openCheckout() {
  if (cart.size === 0) {
    showToast("Your cart is empty. Add a product first.");
    return;
  }

  const checkoutItems = document.getElementById("checkoutItems");
  checkoutItems.replaceChildren();

  cart.forEach((quantity, productId) => {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "checkout-row";

    const name = document.createElement("span");
    name.textContent = `${product.name} × ${quantity}`;

    const price = document.createElement("strong");
    price.textContent = formatPrice(product.price * quantity);

    row.append(name, price);
    checkoutItems.appendChild(row);
  });

  const { total } = getCartSummary();
  document.getElementById("checkoutTotal").textContent =
    formatPrice(total);

  checkoutModal.showModal();
}

// Clear the entire cart.
document.getElementById("clearCart").addEventListener("click", () => {
  if (cart.size === 0) {
    showToast("Your cart is already empty.");
    return;
  }

  cart.clear();
  renderCart();
  showToast("Cart cleared.");
});

// Open checkout preview.
document.getElementById("checkoutButton").addEventListener(
  "click",
  openCheckout
);

// Close checkout modal.
document.getElementById("closeModal").addEventListener("click", () => {
  checkoutModal.close();
});

// Demo confirmation only: no payment or order is actually processed.
document.getElementById("placeOrder").addEventListener("click", () => {
  if (cart.size === 0) {
    checkoutModal.close();
    showToast("Your cart is empty.");
    return;
  }

  cart.clear();
  renderCart();
  checkoutModal.close();
  showToast("Demo order confirmed. Thank you!");
});

// Close the modal by clicking outside its contents.
checkoutModal.addEventListener("click", event => {
  if (event.target === checkoutModal) {
    checkoutModal.close();
  }
});

// Initialize the app.
renderProducts();
renderCart();
