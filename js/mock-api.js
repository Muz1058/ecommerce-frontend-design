// ---- MOCK DATA ----
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "HAVIT HV-G92 Gamepad",
    price: 120,
    originalPrice: 160,
    discount: 40,
    rating: 5,
    ratingCount: 88,
    image: "resourses/Havic HV G-92 Gamepad/HAVIT HV-G92 Gamepad2.png",
  },
  {
    id: "2",
    name: "AK-900 Wired Keyboard",
    price: 960,
    originalPrice: 1160,
    discount: 35,
    rating: 5,
    ratingCount: 75,
    image: "resourses/AK-900 Wired Keyboard/AK-900 Wired Keyboard.png",
  },
  {
    id: "3",
    name: "IPS LCD Gaming Monitor",
    price: 370,
    originalPrice: 400,
    discount: 30,
    rating: 5,
    ratingCount: 99,
    image: "resourses/IPS LCD Gaming Monitor/IPS LCD Gaming Monitor.png",
  },
  {
    id: "4",
    name: "RGB liquid CPU Cooler",
    price: 160,
    originalPrice: 170,
    discount: 8.5,
    rating: 5,
    ratingCount: 65,
    image: "resourses/RGB liquid CPU Cooler/RGB liquid CPU Cooler.png",
  }
];

// ---- MOCK API ----
window.MockAPI = {
  // Simulate fetching all products
  getProducts: () => Promise.resolve(MOCK_PRODUCTS),

  // Simulate getting a single product by id
  getProduct: (id) => Promise.resolve(MOCK_PRODUCTS.find(p => p.id === id)),

  // Simulate signup/login (stores/retrieves in localStorage)
  signup: ({name, email, password}) => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      return Promise.reject({message: "Email already exists."});
    }
    users.push({name, email, password});
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({name, email}));
    return Promise.resolve({name, email});
  },
  login: ({email, password}) => {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    if (!user) return Promise.reject({message: "Invalid credentials."});
    localStorage.setItem('currentUser', JSON.stringify({name: user.name, email}));
    return Promise.resolve({name: user.name, email});
  },
  logout: () => {
    localStorage.removeItem('currentUser');
    return Promise.resolve();
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  },
  // Cart in localStorage
  getCart: () => JSON.parse(localStorage.getItem('cart') || '[]'),
  setCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
  clearCart: () => localStorage.removeItem('cart'),
};