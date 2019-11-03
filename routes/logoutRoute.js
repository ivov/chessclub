const express = require("express");
const logger = require("../logging/logger");

const router = express.Router();

// base url: "/api/logout"

router.get("/", (request, response) => {
  const username = request.query.username;
  logger.info({ label: "logout", message: username });
  response.status(200).send("User logged out");
});

module.exports = router;
