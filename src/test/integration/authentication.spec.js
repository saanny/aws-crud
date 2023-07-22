const request = require("supertest");
const { emptyTables, setData } = require("../../utils/testHelpers/functions");

describe("authentication integration tests", () => {
  const server = request("http://localhost:3000/api/v1");
  beforeEach((done) => {
    const tablesData = [
      {
        table: `users`,
        items: [{ id: { S: "test" } }]
      },
      {
        table: `products`,
        items: [{ id: { S: "test" } }]
      }
    ];
    setData(tablesData, done);
    emptyTables(
      [
        { table: "users", hashKey: ["id"] },
        { table: "products", hashKey: ["id"] }
      ],
      done
    );
  });
  it("Register - should return user and token when if register completed ", (done) => {
    server
      .post("/auth/register")
      .send({
        first_name: "amir",
        last_name: "ahmadi",
        email: "amirfahmadidev@gmail.com",
        password: "123515sfkafgjgas@da"
      })
      .expect(201)
      .end((error, result) => {
        if (error) return done(error);
        expect(result.body.status).toBe("success");
        expect(result.body.data?.user?.email).toBe("amirfahmadidev@gmail.com");
        expect(result.body.data?.token).toEqual(expect.any(String));
        return done();
      });
  });

  it("Register - should return 409 conflict error if user already exist", (done) => {
    server
      .post("/auth/register")
      .send({
        first_name: "amir",
        last_name: "ahmadi",
        email: "amirfahmadidev@gmail.com",
        password: "123515sfkafgjgas@da"
      })
      .expect(201)
      .end((error, result) => {
        server
          .post("/auth/register")
          .send({
            first_name: "amir",
            last_name: "ahmadi",
            email: "amirfahmadidev@gmail.com",
            password: "123515sfkafgjgas@da"
          })
          .expect(409)
          .end((error, result) => {
            if (error) return done(error);
            return done();
          });
      });
  });

  it("Login - should return user and token if user exist and email and password correct", (done) => {
    server
      .post("/auth/register")
      .send({
        first_name: "amir",
        last_name: "ahmadi",
        email: "amirfahmadidev@gmail.com",
        password: "123515sfkafgjgas@da"
      })
      .expect(201)
      .end((error, result) => {
        server
          .post("/auth/login")
          .send({
            email: "amirfahmadidev@gmail.com",
            password: "123515sfkafgjgas@da"
          })
          .expect(200)
          .end((error, result) => {
            if (error) return done(error);

            expect(result.body.status).toBe("success");
            expect(result.body.data?.user?.email).toBe(
              "amirfahmadidev@gmail.com"
            );
            expect(result.body.data?.token).toEqual(expect.any(String));
            return done();
          });
      });
  });

  it("Login - should return 401 error if email notfound", (done) => {
    server
      .post("/auth/register")
      .send({
        first_name: "amir",
        last_name: "ahmadi",
        email: "amirfahmadidev@gmail.com",
        password: "123515sfkafgjgas@da"
      })
      .expect(201)
      .end((error, result) => {
        server
          .post("/auth/login")
          .send({
            email: "testemail@gmail.com",
            password: "123515sfkafgjgas@da"
          })
          .expect(401)
          .end((error, result) => {
            if (error) return done(error);
            return done();
          });
      });
  });

  it("Login - should return 401 error if password not correct", (done) => {
    server
      .post("/auth/register")
      .send({
        first_name: "amir",
        last_name: "ahmadi",
        email: "amirfahmadidev@gmail.com",
        password: "123515sfkafgjgas@da"
      })
      .expect(201)
      .end((error, result) => {
        server
          .post("/auth/login")
          .send({
            email: "amirfahmadidev@gmail.com",
            password: "123515sfkadagas323232323fgjgas@da"
          })
          .expect(401)
          .end((error, result) => {
            if (error) return done(error);
            return done();
          });
      });
  });
});
