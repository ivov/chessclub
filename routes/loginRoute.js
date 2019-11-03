const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../db/dbConn");
const logger = require("../logging/logger");

const router = express.Router();

// base url: "/api/login"

const sql = {
  readForLogin:
    "SELECT username, password, is_admin FROM users WHERE username = $1;"
};

router.post("/", async (request, response) => {
  const { username, password: incomingPassword } = request.body;
  const result = await pool.query(sql.readForLogin, [username]);

  const isUserInDb = result.rowCount > 0;
  if (!isUserInDb) return response.status(400).send("El usuario es inválido.");

  const { password: storedPassword, is_admin } = result.rows[0];
  const doesPassMatch = await bcrypt.compare(incomingPassword, storedPassword);
  if (!doesPassMatch)
    return response.status(400).send("La contraseña es inválida.");

  const token = jwt.sign({ username, is_admin }, process.env.JWT_KEY);

  response
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .status(200)
    .send("Valid user and password");
  logger.info({ label: "login", message: username });
});

module.exports = router;
