import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

const should = chai.should();
chai.use(chaiHttp);

setTimeout(function () {
  run();
}, 5000);

var loggedInToken = "";
var teamId = "";

describe("Testing Manage teams route ", () => {
  before((done) => {
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send({
        username: "Admin",
        password: "password",
      })
      .end((err, response) => {
        loggedInToken = response.body.token;
        done();
      });
  });
  it("It should add teams to the DB", (done) => {
    chai
      .request(app)
      .post("/api/v1/teams/")
      .set("authorization", `Bearer ${loggedInToken}`)
      .send({
        name: "Chelsea",
        logo: "htps://source.unsplash.com/random",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.should.have.property("logo");
        teamId = res.body._id;
        done();
      });
  });
  it("It should update the team details with the id provided ", (done) => {
    chai
      .request(app)
      .put(`/api/v1/teams/${teamId}`)
      .set("authorization", `Bearer ${loggedInToken}`)
      .send({
        logo: "htps://source.unsplash.com/random",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("logo");
        done();
      });
  });
  it("It should get all teams from the DB", (done) => {
    chai
      .request(app)
      .get("/api/v1/teams")
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  it("It should get the details of the team with the id provided from the DB", (done) => {
    chai
      .request(app)
      .get(`/api/v1/teams/${teamId}`)
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("name");
        res.body.should.have.property("logo");
        done();
      });
  });
  it("It should delete one team with id provided from the DB", (done) => {
    chai
      .request(app)
      .delete(`/api/v1/teams/${teamId}`)
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("It should delete all teams from the DB", (done) => {
    chai
      .request(app)
      .delete("/api/v1/teams")
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("deletedCount");
        done();
      });
  });
  it("It should verify if user is authenticated to call teams route", (done) => {
    chai
      .request(app)
      .delete("/api/v1/teams")
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
