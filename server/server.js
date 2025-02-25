
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());

const db = new sqlite3.Database("./stock-data.db", (err) => {
  if (err) console.error("Error connecting to database:", err.message);
  else console.log("Connected to SQLite database");
});

db.run("CREATE INDEX IF NOT EXISTS idx_index_name ON indices (index_name);");
app.get("/indices", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  db.all("SELECT DISTINCT index_name FROM indices LIMIT ? OFFSET ?", [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(rows.map(row => row.index_name));
  });
});

app.get("/index/:name", (req, res) => {
  const indexName = req.params.name;
  db.get("SELECT * FROM indices WHERE index_name = ? LIMIT 1", [indexName], (err, row) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (!row) return res.status(404).json({ error: "Index not found" });
    res.json(row);
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
