require('dotenv').config();
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const path = require("path");

async function migrateData() {
  try {
    console.log("\n🔄 Starting migration from SQLite to MySQL...");

    // Open SQLite database
    const sqliteDbPath = path.join(__dirname, "data", "agency.db");
    const sqlite = new sqlite3.Database(sqliteDbPath);

    // Get all records from SQLite
    const leads = await new Promise((resolve, reject) => {
      sqlite.all(
        "SELECT id, name, email, goals, created_at FROM leads",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });

    console.log(`📦 Found ${leads.length} records in SQLite`);

    if (leads.length === 0) {
      console.log("✓ No records to migrate.");
      sqlite.close();
      process.exit(0);
      return;
    }

    // Connect to MySQL
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "prismpulse",
    });

    // Insert into MySQL
    let inserted = 0;
    for (const lead of leads) {
      try {
        await conn.execute(
          "INSERT INTO leads (id, name, email, goals, created_at) VALUES (?, ?, ?, ?, ?)",
          [lead.id, lead.name, lead.email, lead.goals, lead.created_at]
        );
        inserted++;
      } catch (error) {
        console.error(`Error inserting lead ${lead.id}:`, error.message);
      }
    }

    console.log(`✓ Successfully migrated ${inserted}/${leads.length} records`);

    // Verify counts
    const [result] = await conn.execute("SELECT COUNT(*) as count FROM leads");
    console.log(`📊 MySQL now has ${result[0].count} total records`);
    console.log("✅ Migration complete!\n");

    sqlite.close();
    await conn.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error.message);
    process.exit(1);
  }
}

migrateData();
