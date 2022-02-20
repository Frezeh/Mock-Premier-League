import { Router } from "express";
import { searchFunction } from "../controller/searchController";

const searchRouter = Router();

searchRouter.get("/", searchFunction);

export default searchRouter;
