import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

const should = chai.should();
chai.use(chaiHttp);

setTimeout(function () {
  run();
}, 5000);

describe("Testing for non existing routes ", () => {
  it("It should successfully navigate to the route", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
  it("It should throw an error for a wrong route", (done) => {
    chai
      .request(app)
      .get("/api/v1/wrongroute")
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a("object");
        res.body.should.have.property("success").equal(false);
        res.body.should.have.property("error").equal("Not Found");
        done();
      });
  });
});
