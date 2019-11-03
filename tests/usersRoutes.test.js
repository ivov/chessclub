const request = require("supertest");
const app = require("../server");
const utils = require("./testUtils");

describe("usersRoutes", () => {
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
  describe("GET /api/users", () => {
    let response;

    beforeAll(async () => {
      response = await request(server).get("/api/users");
    });

    it("should return 200 response", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return array", () => {
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/users/allForAdmin", () => {
    let response;

    beforeAll(async () => {
      response = await request(server).get("/api/users/allForAdmin");
    });

    it("should return 200 response", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return array", () => {
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // get requests with parameters
  describe("GET /api/users/idByUsername/:username", () => {
    let response;

    beforeAll(async () => {
      const randomUsername = await utils.getRandomUsername();
      response = await request(server).get(
        `/api/users/idByUsername/${randomUsername}`
      );
    });

    it("should return 200 response", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return int", () => {
      expect(Number.isInteger(response.body)).toBe(true);
    });
  });

  describe("GET /api/users/userForProfile/:id", () => {
    let response;

    beforeAll(async () => {
      const randomId = await utils.getRandomUserId();
      response = await request(server).get(
        `/api/users/userForProfile/${randomId}`
      );
    });

    it("should return 200 response", () => {
      expect(response.statusCode).toBe(200);
    });

    it("should return object", () => {
      expect(typeof response).toBe("object");
    });
  });

  // get requests with query strings
  describe("GET /api/users/idByUsernameForBoth", () => {
    let idResponse, idForBoth;

    beforeAll(async () => {
      [
        idForBoth,
        idResponse
      ] = await utils.getIdForBothAndIdResponse_atRandom();
    });

    it("should return 200 response", () => {
      expect(idResponse.statusCode).toBe(200);
    });

    it("should return Array containing two integers", () => {
      expect(Number.isInteger(idForBoth[0])).toBe(true);
      expect(Number.isInteger(idForBoth[1])).toBe(true);
    });
  });

  describe("GET /api/users/usernameByIdForBoth", () => {
    let usernameForBoth, usernameResponse;

    beforeAll(async () => {
      [
        usernameForBoth,
        usernameResponse
      ] = await utils.getUsernameForBothAndUsernameResponse_atRandom();
    });

    it("should return 200 response", () => {
      expect(usernameResponse.statusCode).toBe(200);
    });

    it("should return Array containing two strings", () => {
      expect(typeof usernameForBoth[0]).toBe("string");
      expect(typeof usernameForBoth[1]).toBe("string");
    });
  });

  describe("POST /api/users", () => {
    it("should return 201 response", async () => {
      const response = await request(server)
        .post("/api/users/")
        .send({
          username: await utils.createRandomString(),
          password: await utils.createRandomString(),
          email: await utils.createRandomString()
        });
      expect(response.statusCode).toBe(201);
    });
  });
});

// pending implementation in frontend
//   describe("PUT /api/users/:id", () => {
//     it("should return 200 response", async () => {
//       const randomId = getRandomUserId();
//       const response = await request(server)
//         .put(`/api/users/${randomId}`)
//         .send({
//           username: await getRandomUsername(),
//           password: await createRandomString(),
//           email: await createRandomString()
//         });
//       expect(response.statusCode).toBe(200);
//     });
//   });

// pending implementation in frontend
//   describe(DELETE "/api/users/:id", () => {
//     it("should return 200 response", async () => {
//       const randomId = getRandomUserId();
//       const response = await request(server)
//         .delete(`/api/users/${randomId}`)
//         .send({
//           username: await getRandomUsername()
//         });
//       expect(response.statusCode).toBe(200);
//     });
//   });
// });

module.exports = server;
