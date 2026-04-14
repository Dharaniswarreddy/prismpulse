import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "prismpulse",
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
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

      return res.status(201).json({
        message: "lead saved",
        id: result.insertId,
      });
    } catch (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "database error" });
    } finally {
      if (conn) conn.release();
    }
  }

  if (req.method === "GET") {
    let conn;
    try {
      conn = await pool.getConnection();
      const [rows] = await conn.execute(
        "SELECT id, name, email, goals, created_at FROM leads ORDER BY id DESC LIMIT 100"
      );

      return res.status(200).json({ leads: rows });
    } catch (error) {
      console.error("Database error:", error.message);
      return res.status(500).json({ error: "database error" });
    } finally {
      if (conn) conn.release();
    }
  }

  res.status(405).json({ error: "method not allowed" });
}
