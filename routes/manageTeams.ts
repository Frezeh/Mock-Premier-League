// @ts-nocheck
import { Router } from "express";
import * as authenticate from "../middleware/authenticate";
import { addTeams, cache, deleteOneTeam, deleteTeams, updateTeam, viewOneTeam, viewTeams } from "../controller/teamController";

const teamsRouter = Router();

teamsRouter.get("/", authenticate.verifyUser, cache).post("/", authenticate.verifyUser, authenticate.verifyAdmin, addTeams).delete("/", authenticate.verifyUser, authenticate.verifyAdmin, deleteTeams);
teamsRouter.get("/:teamsId", authenticate.verifyUser, viewOneTeam).put("/:teamsId", authenticate.verifyUser, authenticate.verifyAdmin, updateTeam).delete("/:teamsId", authenticate.verifyUser, authenticate.verifyAdmin, deleteOneTeam);

export default teamsRouter;
