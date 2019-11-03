const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

let pool;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL, // from Heroku
    ssl: true
  });
} else {
  pool = new Pool({
    connectionString: process.env.DEV_CONNSTRING
  });
}

module.exports = pool;
