const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routesMain");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const helmet = require("helmet");

// autopatch asyncErrorCatcher middleware onto all routes
require("express-async-errors");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.use("/api/users", routes.users);
app.use("/api/news", routes.news);
app.use("/api/games", routes.games);
app.use("/api/login", routes.login);
app.use("/api/logout", routes.logout);
app.use("/api/log", routes.log);
app.use(errorHandler);
// app.use(helmet());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App listening on port ${port}`));

module.exports = app;
