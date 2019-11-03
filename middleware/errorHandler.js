const logger = require("../logging/logger");

const errorHandler = (error, request, response, next) => {
  logger.log({ level: "error", message: error.message });
  response.status(500).send("An error has occurred!");
};

module.exports = errorHandler;
