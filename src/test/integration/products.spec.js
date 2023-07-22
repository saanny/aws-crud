const request = require("supertest");
const { emptyTables, setData } = require("../../utils/testHelpers/functions");

describe("products integration tests", () => {
  const server = request("http://localhost:3000/api/v1");

  describe("check route authentication", () => {
    it("Products - should get unauthenticated error if access token was not provided", (done) => {
      server
        .post("/products")
        .send({
          name: "test product",
          detail: "test detail product"
        })
        .expect(401)
        .end((error, result) => {
          if (error) return done(error);
          return done();
        });
    });
  });
  describe("products controller", () => {
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

    it("Products - should return product if data provided", (done) => {
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
              server
                .post("/products")
                .set("Authorization", `Bearer ${result.body.data?.token}`)
                .send({
                  name: "test product",
                  detail: "test detail product"
                })
                .expect(201)
                .end((error, result) => {
                  if (error) return done(error);
                  return done();
                });
            });
        });
    });

    it("Products - should return 400 error if input field not provided", (done) => {
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
              server
                .post("/products")
                .set("Authorization", `Bearer ${result.body.data?.token}`)
                .send({
                  name: "test product"
                })
                .expect(400)
                .end((error, result) => {
                  if (error) return done(error);
                  return done();
                });
            });
        });
    });

    it("Products - should return product if id was exist", (done) => {
      let token;
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
              token = result.body.data?.token;
              server
                .post("/products")
                .set("Authorization", `Bearer ${result.body.data?.token}`)
                .send({
                  name: "test product",
                  detail: "product details"
                })
                .expect(201)
                .end((error, result) => {
                  server
                    .get(`/products/${result.body.data.id}`)
                    .set("Authorization", `Bearer ${token}`)
                    .expect(200)
                    .end((error, result) => {
                      if (error) return done(error);
                      return done();
                    });
                });
            });
        });
    });

    it("Products - should return all user products", (done) => {
      let token = "";
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
              token = result.body.data?.token;
              server
                .post("/products")
                .set("Authorization", `Bearer ${token}`)
                .send({
                  name: "test product",
                  detail: "product details"
                })
                .expect(201)
                .end((error, result) => {
                  server
                    .get(`/products`)
                    .set("Authorization", `Bearer ${token}`)
                    .expect(200)
                    .end((error, result) => {
                      if (error) return done(error);

                      expect(result.body.data?.Items).toEqual(
                        expect.any(Array)
                      );
                      expect(typeof result.body.data?.Count).toBe("number");
                      return done();
                    });
                });
            });
        });
    });

    it("Products - should delete product", (done) => {
      let token = "";
      let productId = "";
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
              token = result.body.data?.token;
              server
                .post("/products")
                .set("Authorization", `Bearer ${token}`)
                .send({
                  name: "test product",
                  detail: "product details"
                })
                .expect(201)
                .end((error, result) => {
                  productId = result.body.data.id;

                  server
                    .delete(`/products/${productId}`)
                    .set("Authorization", `Bearer ${token}`)
                    .expect(200)
                    .end((error, result) => {
                      if (error) return done(error);
                      expect(result.body.status).toBe("success");
                      expect(result.body.message).toBe("Successfully deleted");

                      return done();
                    });
                });
            });
        });
    });

    it("Products - should update product", (done) => {
      let token = "";
      let productId = "";
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
              token = result.body.data?.token;
              server
                .post("/products")
                .set("Authorization", `Bearer ${token}`)
                .send({
                  name: "test product",
                  detail: "product details"
                })
                .expect(201)
                .end((error, result) => {
                  productId = result.body.data.id;

                  server
                    .patch(`/products/${productId}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                      name: "new test product",
                      detail: "new product details"
                    })
                    .expect(200)
                    .end((error, result) => {
                      if (error) return done(error);

                      expect(result.body.status).toBe("success");
                      expect(result.body.message).toBe(
                        `Product with ID ${productId} updated successfully.`
                      );

                      return done();
                    });
                });
            });
        });
    });
  });
});
