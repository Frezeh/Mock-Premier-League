// @ts-nocheck
import { Router } from "express";
import * as authenticate from "../middleware/authenticate";
import {
  addFixtures,
  deleteFixtures,
  deleteOnefixture,
  updatefixture,
  cache,
  viewUniquefixture,
} from "../controller/fixtureController";

const fixturesRouter = Router();

fixturesRouter
  .get("/", authenticate.verifyUser, cache)
  .post("/", authenticate.verifyUser, authenticate.verifyAdmin, addFixtures)
  .delete(
    "/",
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    deleteFixtures
  );
fixturesRouter
  .get("/:slug", authenticate.verifyUser, viewUniquefixture)
  .put(
    "/:fixturesId",
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    updatefixture
  )
  .delete(
    "/:fixturesId",
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    deleteOnefixture
  );

export default fixturesRouter;
