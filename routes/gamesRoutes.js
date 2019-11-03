const express = require("express");
const pool = require("../db/dbConn");
const userProtector = require("../middleware/userProtector");
const adminProtector = require("../middleware/adminProtector");
const logger = require("../logging/logger");

const router = express.Router();

// base url: "/api/games"

const sql = {
  readGamesForChoice: `
    SELECT
      games.id,
      date,
      u1.username AS white,
      u2.username AS black
    FROM
      games
    INNER JOIN
      users u1 ON (games.white = u1.id)
    INNER JOIN
      users u2 ON (games.black = u2.id)
    ORDER BY
      games.date DESC;
    `,
  readGame: "SELECT * FROM games WHERE id = $1;",
  readGameForDisplay: `
    SELECT
      games.id,
      date,
      event,
      moves,
      u1.username AS white,
      u2.username AS black,
      u3.username AS winner
    FROM
      games
    INNER JOIN
      users u1 ON (games.white = u1.id)
    INNER JOIN
      users u2 ON (games.black = u2.id)
    INNER JOIN
      users u3 ON (games.winner = u3.id)
    WHERE
      games.id = $1;
  `,
  createGame:
    "INSERT INTO games (date, event, white, black, winner, moves) VALUES ($1, $2, $3, $4, $5, $6);",
  updateGame:
    "UPDATE games SET date = $1, event = $2, white = $3, black = $4, winner = $5, moves = $6 WHERE id = $7;",
  deleteGame: "DELETE FROM games WHERE id = $1;",
  readGamesForPlayerProfile: `
  SELECT
    id,
    date,
    white,
    black
  FROM
    (SELECT games.id, date, u1.username AS white, u2.username AS black, u1.id AS white_id, u2.id AS black_id
    FROM games
    INNER JOIN users u1 ON (games.white = u1.id)
    INNER JOIN users u2 ON (games.black = u2.id)
    ORDER BY games.date DESC) AS all_games
  WHERE
    white_id = $1 or black_id = $1;
`
};

// GamesList
router.get("/", async (request, response) => {
  const result = await pool.query(sql.readGamesForChoice);
  let gamesArray = [];
  for (let object of result.rows) {
    gamesArray.push({
      id: object.id,
      white: object.white,
      black: object.black,
      date: object.date
    });
  }
  response.status(200).json(gamesArray);
});

// Board, GameEditArea
router.get("/gameForDisplay/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const result = await pool.query(sql.readGameForDisplay, [id]);
  const game = {
    date: result.rows[0].date,
    event: result.rows[0].event,
    white: result.rows[0].white,
    black: result.rows[0].black,
    winner: result.rows[0].winner,
    pgn: result.rows[0].moves
  };
  response.status(200).json(game);
});

// PlayerProfile
router.get("/userGames/:id", async (request, response) => {
  const userId = parseInt(request.params.id);
  const result = await pool.query(sql.readGamesForPlayerProfile, [userId]);
  response.status(200).json(result.rows);
});

// GameInputArea
router.post("/", userProtector, (request, response) => {
  const { date, event, white, black, winner, moves } = request.body;
  const gameProperties = [date, event, white, black, winner, moves];
  pool.query(sql.createGame, gameProperties);
  response.status(201).send(`Created game ${date}`);
  logger.info({
    label: "game-created",
    message: `players: ${white} vs. ${black} - author: ${request.decodedPayload.username}`
  });
});

// GameEditArea
router.put("/:id", userProtector, (request, response) => {
  const { date, event, white, black, winner, moves } = request.body;
  const id = parseInt(request.params.id);
  const gameProperties = [date, event, white, black, winner, moves, id];
  pool.query(sql.updateGame, gameProperties);
  response.status(200).send(`Game ${id} updated`);
  logger.info({
    label: "game-updated",
    message: `date: ${date} - players: ${white} vs. ${black} - author: ${request.decodedPayload.username}`
  });
});

// pending
router.delete("/:id", [userProtector, adminProtector], (request, response) => {
  const { date, white, black } = request.body;
  const id = parseInt(request.params.id);
  pool.query(sql.deleteGame, [id]);
  response.status(200).send(`Deleted game ${id}`);
  logger.info({
    label: "game-deleted",
    message: `date: ${date} - players: ${white} vs. ${black} - author: ${request.decodedPayload.username}`
  });
});

module.exports = router;
