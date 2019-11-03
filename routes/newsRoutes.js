const express = require("express");
const pool = require("../db/dbConn");
const userProtector = require("../middleware/userProtector");
const adminProtector = require("../middleware/adminProtector");
const logger = require("../logging/logger");

const router = express.Router();

// base url: "/api/news"

const sql = {
  readAllNewsItems: "SELECT * FROM news ORDER BY date DESC;",
  readNewsItem: "SELECT * FROM news WHERE id = $1;",
  createNewsItem: "INSERT INTO news (title, body, date) VALUES ($1, $2, $3);",
  updateNewsItem: "UPDATE news SET title = $1, body = $2 WHERE id = $3;",
  deleteNewsItem: "DELETE FROM news WHERE id = $1;"
};

router.get("/", async (request, response) => {
  const result = await pool.query(sql.readAllNewsItems);
  response.status(200).json(result.rows);
});

router.get("/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const result = await pool.query(sql.readNewsItem, [id]);
  response.status(200).json(result.rows);
});

router.post("/", [userProtector, adminProtector], (request, response) => {
  const { title, body, date } = request.body;
  const newsProperties = [title, body, date];
  pool.query(sql.createNewsItem, newsProperties);
  response.status(201).send(`Created news item ${title}`);
  logger.info({
    label: "news-created",
    message: title
  });
});

router.put("/:id", [userProtector, adminProtector], (request, response) => {
  const { title, body } = request.body;
  const id = parseInt(request.params.id);
  const newsProperties = [title, body, id];
  pool.query(sql.updateNewsItem, newsProperties);
  response.status(200).send(`Updated news item ${title}`);
  logger.info({
    label: "news-edited",
    message: title
  });
});

router.delete("/:id", [userProtector, adminProtector], (request, response) => {
  const id = parseInt(request.params.id);
  pool.query(sql.deleteNewsItem, [id]);
  response.status(200).send(`Deleted news item ${id}`);
  logger.info({
    label: "news-deleted",
    message: title
  });
});

module.exports = router;
