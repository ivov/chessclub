const express = require("express");
const userProtector = require("../middleware/userProtector");
const adminProtector = require("../middleware/adminProtector");
const fs = require("fs");

const router = express.Router();

// base url: "/api/log"

router.get("/", [userProtector, adminProtector], (request, response) => {
  const logfile = fs.readFileSync("logging/info.log", "utf8");
  const arrayedLogfile = "[" + logfile + "]";
  const commaSeparatedLogfile = arrayedLogfile
    .replace(/\n/g, ",")
    .replace(",]", "]");
  response.status(200).send(commaSeparatedLogfile);
});

module.exports = router;
