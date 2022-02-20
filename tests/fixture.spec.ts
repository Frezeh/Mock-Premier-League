// @ts-nocheck
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

const should = chai.should();
chai.use(chaiHttp);

setTimeout(function () {
  run();
}, 5000);

var loggedInToken = "";
var fixtureId = "";
var slug = "";

describe("Testing Create fixtures route ", () => {
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
  it("It should add fixtures to the DB", (done) => {
    chai
      .request(app)
      .post("/api/v1/fixtures")
      .set("authorization", `Bearer ${loggedInToken}`)
      .send({
        homeTeam: "Chelsea",
        awayTeam: "Arsenal",
        time: "2:00 pm",
        date: "12/10/22",
        stadium: "Wembley",
        referee: "Michael Oliver",
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("homeTeam");
        res.body.should.have.property("awayTeam");
        res.body.should.have.property("time");
        res.body.should.have.property("date");
        res.body.should.have.property("stadium");
        res.body.should.have.property("referee");
        fixtureId = res.body._id;
        slug = res.body.slug;
        done();
      });
  });
  it("It should update the team details with the id provided ", (done) => {
    chai
      .request(app)
      .put(`/api/v1/fixtures/${fixtureId}`)
      .set("authorization", `Bearer ${loggedInToken}`)
      .send({
        stadium: "Stamford Bridge",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("stadium");
        done();
      });
  });
  it("It should get all fixtures from the DB", (done) => {
    chai
      .request(app)
      .get("/api/v1/fixtures")
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  it("It should get all pending fixtures from the DB", (done) => {
    chai
      .request(app)
      .get("/api/v1/status/pending")
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  it("It should get all completed fixtures from the DB", (done) => {
    chai
      .request(app)
      .get("/api/v1/status/completed")
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  it("It should get the details of the fixture with the slug from the DB", (done) => {
    chai
      .request(app)
      .get(`/api/v1/fixtures/${slug}`)
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  it("It should delete one fixture with id provided from the DB", (done) => {
    chai
      .request(app)
      .delete(`/api/v1/fixtures/${fixtureId}`)
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("It should delete all teams from the DB", (done) => {
    chai
      .request(app)
      .delete("/api/v1/fixtures")
      .set("authorization", `Bearer ${loggedInToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("deletedCount");
        done();
      });
  });
  it("It should verify if user is authenticated to call fixtures route", (done) => {
    chai
      .request(app)
      .delete("/api/v1/fixtures")
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});
