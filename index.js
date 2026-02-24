const express = require("express");
const cors = require("cors");

const products = require("./data/products");
const users = require("./data/users");

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("Butter backend running 🚀");
});


// ================= PRODUCTS =================

// get all products
app.get("/api/products", (req, res) => {
  const { category } = req.query;

  if (category) {
    const filtered = products.filter(
      p => p.category === category
    );
    return res.json(filtered);
  }

  res.json(products);
});

// get single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(
    p => p.id === Number(req.params.id)
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found!!" });
  }

  res.json(product);
});


// ================= AUTH =================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});


// ================= NOTIFICATIONS =================

app.get("/api/notifications", (req, res) => {
  res.json([
    { id: 1, text: "Your order has shipped" },
    { id: 2, text: "New hoodie collection available" }
  ]);
});


// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
