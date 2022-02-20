import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

const should = chai.should();
chai.use(chaiHttp);

setTimeout(function () {
  run();
}, 5000);

var loggedInToken = "";

describe("Testing Search query route ", () => {
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
  it("It should post a team to the DB that can be searched for ", (done) => {
    chai
    .request(app)
    .post("/api/v1/teams")
    .set("authorization", `Bearer ${loggedInToken}`)
    .send({
      name: "Chelsea",
      logo: "htps://source.unsplash.com/random",
    })
    .end((err, response) => {
      done();
    });
  });
  it("It should robustly search fixtures/teams", (done) => {
    chai
      .request(app)
      .get("/api/v1/search/?name=Chelsea&status=pending")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("SearchResult");
        res.body.SearchResult.should.have.property("team");
        res.body.SearchResult.should.have.property("fixtures");
        done();
      });
  });
  it("It should verify if team been queried is available in the DB", (done) => {
    chai
      .request(app)
      .get("/api/v1/search/?name=Eyimba&status=completd")
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a("object");
        res.body.should.have.property("message").equal("Fixture not found!");
        done();
      });
  });
});
