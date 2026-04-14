require('dotenv').config();
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "prismpulse",
  port: parseInt(process.env.DB_PORT) || 3306,
  ssl: {},
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/leads", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const goals = String(req.body?.goals || "").trim();

  // Stricter validation
  if (!name || name.length < 2 || name.length > 255) {
    return res.status(400).json({ error: "name must be between 2-255 characters" });
  }

  if (!email || email.length > 255) {
    return res.status(400).json({ error: "valid email is required" });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "invalid email format" });
  }

  if (!goals || goals.length < 3 || goals.length > 5000) {
    return res.status(400).json({ error: "goals must be between 3-5000 characters" });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.execute(
      "INSERT INTO leads (name, email, goals) VALUES (?, ?, ?)",
      [name, email, goals]
    );

    console.log(`✓ New lead created: ID=${result.insertId}, email=${email}`);
    return res.status(201).json({
      message: "lead saved",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Database error:", error.message);
    return res.status(500).json({ error: "database error" });
  } finally {
    if (conn) conn.release();
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/leads", async (_req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT id, name, email, goals, created_at FROM leads ORDER BY id DESC LIMIT 100"
    );
    
    console.log(`✓ Fetched ${rows.length} leads`);
    return res.json({ leads: rows });
  } catch (error) {
    console.error("❌ Database error:", error.message);
    return res.status(500).json({ error: "database error" });
  } finally {
    if (conn) conn.release();
  }
});

// Graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
  console.log(`⏰ ${new Date().toISOString()}\n`);
});

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

async function gracefulShutdown() {
  console.log("\n⏹️  Shutdown signal received...");
  
  server.close(async () => {
    console.log("✓ Server closed");
    try {
      await pool.end();
      console.log("✓ Database connections closed");
    } catch (error) {
      console.error("Error closing database:", error);
    }
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error("⚠️  Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}
