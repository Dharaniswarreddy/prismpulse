require('dotenv').config();
const mysql = require("mysql2/promise");

async function setupDatabase() {
  try {
    console.log("\n🔧 Setting up MySQL database on TiDB Cloud...");
    
    // First connect to default database to create prismpulse
    let conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT) || 3306,
      ssl: {},
    });

    // Create database if it doesn't exist
    await conn.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log("✓ Database created or already exists");
    await conn.end();

    // Now connect to the prismpulse database
    conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "prismpulse",
      port: parseInt(process.env.DB_PORT) || 3306,
      ssl: {},
    });

    // Create leads table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        goals TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✓ MySQL table 'leads' created successfully");
    console.log("✅ Database setup complete!\n");

    await conn.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Setup error:", error.message);
    process.exit(1);
  }
}

setupDatabase();
