const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Eshwar1@",
  database: "prismpulse",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/leads", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const goals = String(req.body?.goals || "").trim();

  if (!name || !email || !goals) {
    return res.status(400).json({ error: "name, email, and goals are required" });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "invalid email" });
  }

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.execute(
      "INSERT INTO leads (name, email, goals) VALUES (?, ?, ?)",
      [name, email, goals]
    );
    conn.release();

    return res.status(201).json({
      message: "lead saved",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "database error" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/leads", async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT id, name, email, goals, created_at FROM leads ORDER BY id DESC LIMIT 100"
    );
    conn.release();

    return res.json({ leads: rows });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
