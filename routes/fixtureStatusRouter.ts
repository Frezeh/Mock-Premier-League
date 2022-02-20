// @ts-nocheck
import { Router } from "express";
import * as authenticate from "../middleware/authenticate";
import {
  viewCompletedFixtures,
  viewPendingFixtures,
} from "../controller/fixtureController";

const fixturesStatusRouter = Router();
  
fixturesStatusRouter.get("/pending", authenticate.verifyUser, viewPendingFixtures);
fixturesStatusRouter.get("/completed", authenticate.verifyUser, viewCompletedFixtures);

export default fixturesStatusRouter;