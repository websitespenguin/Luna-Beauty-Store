const phoneNumber = "573001234567"; // Cambia este número por el WhatsApp real de la tienda.

const products = [
  {
    id: 1,
    name: "Primer Power Grip Azul",
    category: "Rostro",
    price: 38900,
    image: "assets/producto-1.svg",
    description: "Primer efecto grip para preparar la piel antes del maquillaje."
  },
  {
    id: 2,
    name: "Rizador de Pestañas Rose Gold",
    category: "Accesorios",
    price: 27900,
    image: "assets/producto-2.svg",
    description: "Rizador elegante con agarre rosa para levantar tus pestañas."
  },
  {
    id: 3,
    name: "Esponja Beauty Blender Rosa",
    category: "Accesorios",
    price: 15900,
    image: "assets/producto-3.svg",
    description: "Esponja suave para difuminar base, corrector y contorno."
  },
  {
    id: 4,
    name: "Delineador Precision Black",
    category: "Ojos",
    price: 44900,
    image: "assets/producto-4.svg",
    description: "Punta fina tipo plumón para trazos intensos y definidos."
  },
  {
    id: 5,
    name: "Paleta de Sombras Nudes Elegance",
    category: "Ojos",
    price: 118900,
    image: "assets/producto-5.svg",
    description: "Sombras cálidas, mates y brillantes para looks naturales o glam."
  },
  {
    id: 6,
    name: "Rubor Rosado Seda",
    category: "Rostro",
    price: 72900,
    image: "assets/producto-6.svg",
    description: "Rubor compacto de tono rosa para un acabado fresco y delicado."
  },
  {
    id: 7,
    name: "Gloss Aceite Labial Pink",
    category: "Labios",
    price: 24900,
    image: "assets/producto-7.svg",
    description: "Brillo hidratante con acabado jugoso y tono rosado suave."
  },
  {
    id: 8,
    name: "Bálsamo Labial Fresa Cute",
    category: "Labios",
    price: 18900,
    image: "assets/producto-8.png",
    description: "Bálsamo con empaque de fresa, perfecto para llevar en el bolso."
  }
];

let cart = JSON.parse(localStorage.getItem("lunaBeautyCart")) || [];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const sendWhatsApp = document.getElementById("sendWhatsApp");

function formatCOP(value) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });
}

function renderProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    const matchesCategory = category === "Todos" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  productsGrid.innerHTML = filteredProducts.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price-row">
          <strong class="price">${formatCOP(product.price)}</strong>
          <button class="add-btn" onclick="addToCart(${product.id})" aria-label="Agregar ${product.name}">
            +
          </button>
        </div>
      </div>
    </article>
  `).join("");

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `<p class="empty-cart">No encontramos productos con esa búsqueda.</p>`;
  }
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  openCartPanel();
}

function decreaseQuantity(productId) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity--;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== productId);
  }

  saveCart();
  renderCart();
}

function increaseQuantity(productId) {
  const item = cart.find((product) => product.id === productId);
  if (!item) return;

  item.quantity++;
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((product) => product.id !== productId);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("lunaBeautyCart", JSON.stringify(cart));
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatCOP(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Tu carrito está vacío 🛍️</h3>
        <p>Agrega productos del catálogo para crear tu pedido.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>${formatCOP(item.price)} c/u</p>
        <div class="qty-controls">
          <button onclick="decreaseQuantity(${item.id})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${item.id})">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">Quitar</button>
    </div>
  `).join("");
}

function openCartPanel() {
  cartPanel.classList.add("active");
  overlay.classList.add("active");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCartPanel() {
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
  cartPanel.setAttribute("aria-hidden", "true");
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    alert("Agrega al menos un producto al carrito.");
    return;
  }

  const orderLines = cart.map((item) =>
    `• ${item.name} x${item.quantity} - ${formatCOP(item.price * item.quantity)}`
  ).join("%0A");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hola Luna Beauty 💗%0AQuiero hacer este pedido:%0A%0A${orderLines}%0A%0ATotal: ${formatCOP(total)}%0A%0A¿Me confirmas disponibilidad?`;

  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
openCart.addEventListener("click", openCartPanel);
closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel);

clearCart.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
});

sendWhatsApp.addEventListener("click", sendOrderToWhatsApp);

renderProducts();
renderCart();
