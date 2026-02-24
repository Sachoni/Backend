// /api/index.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ================= HEALTH CHECK =================
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Butter backend running 🚀",
      server_time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= PRODUCTS =================

// get all products
app.get("/api/products", async (req, res) => {
  const { category } = req.query;

  try {
    let query = "SELECT * FROM products";
    const params = [];

    if (category) {
      query += " WHERE category = $1";
      params.push(category);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found!!" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= AUTH =================

// login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= NOTIFICATIONS =================
app.get("/api/notifications", (req, res) => {
  res.json([
    { id: 1, text: "Your order has shipped" },
    { id: 2, text: "New hoodie collection available" },
  ]);
});

// ================= EXPORT =================
module.exports = app;