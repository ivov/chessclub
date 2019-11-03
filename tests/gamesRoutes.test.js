const request = require("supertest");
const app = require("../");
const utils = require("./testUtils");
const emptyMovesArray = require("../client/src/utils/emptyMovesArray");

describe("gamesRoutes", () => {
  let server;

  beforeAll(done => {
    server = app.listen();
    done();
  });

  afterAll(async done => {
    await server.close();
    done();
  });

  // get requests with no parameters or query strings
  describe("GET /api/games", () => {
    let response;

    beforeAll(async () => {
      response = await request(server).get("/api/games");
    });

    it("should return 200 response", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return array", () => {
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // get requests with parameters
  describe("GET /api/games/gameForDisplay/:id", () => {
    let response;

    beforeAll(async () => {
      const randomGameId = await utils.getRandomGameId();
      response = await request(server).get(
        `/api/games/gameForDisplay/${randomGameId}`
      );
    });

    it("should return 200 response", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return object", () => {
      expect(typeof response).toBe("object");
    });
  });

  describe("GET /api/games/userGames/:id", () => {
    let response;

    beforeAll(async () => {
      const randomUserId = await utils.getRandomUserId();
      response = await request(server).get(
        `/api/games/userGames/${randomUserId}`
      );
    });

    it("should return 200 response", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return array", () => {
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/games", () => {
    it("should return 201 response", async () => {
      const token = await utils.createValidJwtToken();
      const whitePlayer = await utils.getRandomUserId();
      const blackPlayer = await utils.getRandomUserId();
      const winnersArray = [whitePlayer, blackPlayer, 0]; // 0 = "Tablas"
      const winner =
        winnersArray[Math.floor(Math.random() * winnersArray.length)];
      await request(server)
        .post("/api/games")
        .send({
          date: new Date(),
          event: await utils.createRandomString(),
          white: whitePlayer,
          black: blackPlayer,
          winner: winner,
          moves: emptyMovesArray
        })
        .set({ "x-auth-token": token })
        .expect(201);
    });
  });

  describe("PUT /api/games/:id", () => {
    it("should return 200 response", async () => {
      const token = await utils.createValidJwtToken();
      const gameId = await utils.getRandomGameId();
      const whitePlayer = await utils.getRandomUserId();
      const blackPlayer = await utils.getRandomUserId();
      const winnersArray = [whitePlayer, blackPlayer, 0]; // 0 = "Tablas"
      const winner =
        winnersArray[Math.floor(Math.random() * winnersArray.length)];
      await request(server)
        .put(`/api/games/${gameId}`)
        .send({
          date: new Date(),
          event: await utils.createRandomString(),
          white: whitePlayer,
          black: blackPlayer,
          winner: winner,
          moves: emptyMovesArray
        })
        .set({ "x-auth-token": token })
        .expect(200);
    });
  });
});

// pending implementation in frontend
// describe("DELETE", () => {
//   describe("/api/games/:id", () => {
// ...
