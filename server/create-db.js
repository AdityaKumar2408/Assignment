const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const csv = require("csv-parser");

const db = new sqlite3.Database("./stock-data.db");

const BATCH_SIZE = 200;

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS indices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      index_name TEXT,
      index_date TEXT,
      open_index_value REAL,
      high_index_value REAL,
      low_index_value REAL,
      closing_index_value REAL,
      points_change REAL,
      change_percent REAL,
      volume INTEGER,
      turnover_rs_cr REAL,
      pe_ratio REAL,
      pb_ratio REAL,
      div_yield REAL
    );
  `);

  db.run("CREATE INDEX IF NOT EXISTS idx_index_name ON indices (index_name);");

  let records = [];

  function insertBatch() {
    if (records.length === 0) return;

    const batch = records.splice(0, BATCH_SIZE);
    const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",");
    const flattenedValues = batch.flat();

    db.run(
      `INSERT INTO indices (index_name, index_date, open_index_value, high_index_value, low_index_value, closing_index_value, points_change, change_percent, volume, turnover_rs_cr, pe_ratio, pb_ratio, div_yield) VALUES ${placeholders}`,
      flattenedValues,
      (err) => {
        if (err) console.error("Batch insert failed:", err.message);
        else console.log(`Inserted ${batch.length} records`);
        insertBatch(); 
      }
    );
  }

  fs.createReadStream("dump.csv")
    .pipe(csv())
    .on("data", (row) => {
      records.push([
        row.index_name, row.index_date, parseFloat(row.open_index_value),
        parseFloat(row.high_index_value), parseFloat(row.low_index_value),
        parseFloat(row.closing_index_value), parseFloat(row.points_change),
        parseFloat(row.change_percent), parseInt(row.volume),
        parseFloat(row.turnover_rs_cr), parseFloat(row.pe_ratio),
        parseFloat(row.pb_ratio), parseFloat(row.div_yield)
      ]);

      if (records.length >= BATCH_SIZE) {
        insertBatch(); 
      }
    })
    .on("end", () => {
      insertBatch(); 
      console.log("CSV processing completed.");
    });
});
