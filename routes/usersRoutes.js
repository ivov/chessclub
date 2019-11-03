const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/dbConn");
const userProtector = require("../middleware/userProtector");
const adminProtector = require("../middleware/adminProtector");
const logger = require("../logging/logger");

const router = express.Router();

// base url: "/api/users"

const sql = {
  readAllUsers: "SELECT username FROM users;",
  readAllUsersForAdmin: "SELECT username, email, is_admin FROM users",
  readUserForProfile: `
    SELECT
      username, 
      email, 
      (SELECT COUNT(*) FROM games WHERE white = $1 OR black = $1) as games_total, 
      (SELECT COUNT(*) FROM games WHERE winner = $1) AS games_won,
      (SELECT COUNT(*) FROM games WHERE winner = 0 AND white = $1 OR black = $1) AS games_tied
    FROM 
      users
    WHERE 
      users.id = $1;
  `,
  readIdByUsername: "SELECT id FROM users WHERE username = $1;",
  readIdByUsernameForBoth:
    "SELECT id FROM users WHERE username = $1 OR username = $2;",
  readForCreateCheck:
    "SELECT username, email FROM users WHERE username = $1 OR email = $2;",
  createUser:
    "INSERT INTO users (username, password, email) VALUES ($1, $2, $3);",
  updatePassword: "UPDATE users SET password = $1 WHERE id = $2;",
  updateEmail: "UPDATE users SET email = $1 WHERE id = $2;",
  deleteUser: "DELETE FROM users WHERE id = $1;",
  readUsernameByIdForBoth:
    "SELECT username FROM users WHERE id = $1 OR id = $2;"
};

// at GameInputArea
router.get("/", async (request, response) => {
  const result = await pool.query(sql.readAllUsers);
  const usersArray = result.rows.map(object => object.username);
  const filteredArray = usersArray.filter(username => username !== "Tablas");
  response.status(200).json(filteredArray);
});

// at UsersWatchArea
router.get("/allForAdmin", async (request, response) => {
  const result = await pool.query(sql.readAllUsersForAdmin);
  const filteredArray = result.rows.filter(obj => obj.username !== "Tablas");
  response.status(200).json(filteredArray);
});

// at PlayerProfile
router.get("/idByUsername/:username", async (request, response) => {
  const username = request.params.username;
  const result = await pool.query(sql.readIdByUsername, [username]);
  response.status(200).json(result.rows[0].id);
});

// at GameInputArea, GameEditArea
router.get("/idByUsernameForBoth", async (request, response) => {
  const white = request.query.white;
  const black = request.query.black;
  const result = await pool.query(sql.readIdByUsernameForBoth, [white, black]);
  const idForBoth = [result.rows[0].id, result.rows[1].id];
  response.status(200).json(idForBoth);
});

// at LogArea
router.get("/usernameByIdForBoth", async (request, response) => {
  const white = request.query.white;
  const black = request.query.black;
  const result = await pool.query(sql.readUsernameByIdForBoth, [white, black]);
  const usernameForBoth = [result.rows[0].username, result.rows[1].username];
  response.status(200).json(usernameForBoth);
});

// at PlayerProfile
router.get("/userForProfile/:id", async (request, response) => {
  const userId = parseInt(request.params.id);
  const result = await pool.query(sql.readUserForProfile, [userId]);
  response.status(200).json(result.rows[0]);
});

// at GameInputArea
router.post("/", async (request, response) => {
  const {
    username,
    password: incomingPassword,
    email: incomingEmail
  } = request.body;

  const result = await pool.query(sql.readForCreateCheck, [
    username,
    incomingEmail
  ]);

  const usernameOrEmailAlreadyExists = result.rowCount > 0;
  if (usernameOrEmailAlreadyExists) {
    const storedUsername = result.rows[0].username;
    const storedEmail = result.rows[0].email;
    if (username === storedUsername) {
      return response.status(400).send("Este usuario ya existe.");
    } else if (incomingEmail === storedEmail) {
      return response.status(400).send("Este correo ya existe.");
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(incomingPassword, salt);
  const userProperties = [username, hashedPassword, incomingEmail];
  pool.query(sql.createUser, userProperties);

  const token = jwt.sign({ username, is_admin: false }, process.env.JWT_KEY);

  response
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .status(201)
    .send(`Created user ${username}`);
  logger.info({
    label: "user-created",
    message: username
  });
});

router.put("/:id", userProtector, async (request, response) => {
  const { username, password, email } = request.body;
  const id = parseInt(request.params.id);
  const passwordToBeUpdated = password !== undefined;
  const emailToBeUpdated = email !== undefined;
  if (passwordToBeUpdated) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    pool.query(sql.updatePassword, [hashedPassword, id]);
    response.status(200).send(`User ${id}: Password updated`);
    logger.info({
      label: "password-updated",
      message: username
    });
  } else if (emailToBeUpdated) {
    pool.query(sql.updateEmail, [email, id]);
    response.status(200).send(`User ${id}: Email updated`);
    logger.info({
      label: "email-updated",
      message: username
    });
  }
});

router.delete("/:id", [userProtector, adminProtector], (request, response) => {
  const { username } = request.body;
  const id = parseInt(request.params.id);
  pool.query(sql.deleteUser, [id]);
  response.status(200).send(`Deleted user ${id}`);
  logger.info({
    label: "user-deleted",
    message: username
  });
});

module.exports = router;
