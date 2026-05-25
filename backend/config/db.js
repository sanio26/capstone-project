const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "capstone", // IMPORTANT
  password: "sanio23", // IMPORTANT
  port: 5432,
});

pool.connect()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

module.exports = pool;