import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

const should = chai.should();
chai.use(chaiHttp);

setTimeout(function () {
  run();
}, 5000);

describe("Testing User authentication ", () => {
  it("It should signup a user successfully", (done) => {
    const signup = {
      username: `RandomUser${Math.random() * 100}`,
      password: "password",
    };
    chai
      .request(app)
      .post("/api/v1/users/signup")
      .send(signup)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success").equal(true);
        res.body.should.have
          .property("status")
          .equal("Registration Successful!");
        done();
      });
  });
  it("It should verify if user already registered", (done) => {
    const signup = {
      username: "Admin",
      password: "password",
    };
    chai
      .request(app)
      .post("/api/v1/users/signup")
      .send(signup)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a("object");
        res.body.should.have.property("err");
        res.body.err.should.have.property("name").equal("UserExistsError");
        res.body.err.should.have
          .property("message")
          .equal("A user with the given username is already registered");
        done();
      });
  });
  it("It should successfully login the user and return a JWT token and userId", (done) => {
    const login = {
      username: "Admin",
      password: "password",
    };
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send(login)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("token");
        res.body.should.have.property("id");
        res.body.should.have.property("success").equal(true);
        res.body.should.have.property("status").equal("Login Successful!");
        done();
      });
  });
  it("It should verify if there is a problem with the login", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send({})
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a("object");
        res.body.should.have.property("success").equal(false);
        res.body.should.have.property("status").equal("Login Unsuccessful!");
        res.body.should.have.property("err");
        done();
      });
  });
});
