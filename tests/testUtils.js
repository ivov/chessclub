const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../server");

server = app.listen();

const getRandomUsername = async () => {
  const usersResponse = await request(server).get("/api/users");
  const usersArray = usersResponse.body;
  const randomUsername =
    usersArray[Math.floor(Math.random() * usersArray.length)];
  return randomUsername;
};

const getRandomUserId = async () => {
  const randomUsername = await getRandomUsername();
  const idResponse = await request(server).get(
    `/api/users/idByUsername/${randomUsername}`
  );
  return idResponse.body;
};

const getIdForBothAndIdResponse_atRandom = async () => {
  const idResponse = await request(server)
    .get("/api/users/idByUsernameForBoth")
    .query({
      white: await getRandomUsername(),
      black: await getRandomUsername()
    });
  const idForBoth = [idResponse.body[0], idResponse.body[1]];
  return [idForBoth, idResponse];
};

const getUsernameForBothAndUsernameResponse_atRandom = async () => {
  const usernameResponse = await request(server)
    .get("/api/users/usernameByIdForBoth")
    .query({
      white: await getRandomUserId(),
      black: await getRandomUserId()
    });
  const usernameForBoth = [usernameResponse.body[0], usernameResponse.body[1]];
  return [usernameForBoth, usernameResponse];
};

const createRandomString = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};

const getRandomGameId = async () => {
  const response = await request(server).get("/api/games");
  const gamesArray = response.body;
  return gamesArray[Math.floor(Math.random() * gamesArray.length)].id;
};

const createValidJwtToken = async () => {
  return jwt.sign(
    { username: await getRandomUsername(), is_admin: false },
    process.env.JWT_KEY
  );
};

server.close();

module.exports = {
  getRandomUsername,
  getRandomUserId,
  getIdForBothAndIdResponse_atRandom,
  getUsernameForBothAndUsernameResponse_atRandom,
  createRandomString,
  getRandomGameId,
  createValidJwtToken
};
