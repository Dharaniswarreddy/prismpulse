const mysql = require("mysql2/promise");

async function setupDatabase() {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Eshwar1@",
      database: "prismpulse",
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

    await conn.end();
    process.exit(0);
  } catch (error) {
    console.error("Setup error:", error);
    process.exit(1);
  }
}

setupDatabase();
