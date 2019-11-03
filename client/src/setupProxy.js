// For development:
// If a request comes in for /api/*, then respond using the backend
// Node server default domain and port: http://localhost:5000 (server.js)

const proxy = require("http-proxy-middleware");

if (process.env.NODE_ENV === "development") {
  module.exports = function(app) {
    app.use(proxy("/api", { target: "http://localhost:5000/" }));
  };
}
