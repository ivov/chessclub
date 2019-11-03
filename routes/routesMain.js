const usersRoutes = require("./usersRoutes");
const newsRoutes = require("./newsRoutes");
const gamesRoutes = require("./gamesRoutes");
const loginRoute = require("./loginRoute");
const logoutRoute = require("./logoutRoute");
const logRoute = require("./logRoute");

const routes = {
  users: usersRoutes,
  news: newsRoutes,
  games: gamesRoutes,
  login: loginRoute,
  logout: logoutRoute,
  log: logRoute
};

module.exports = routes;
