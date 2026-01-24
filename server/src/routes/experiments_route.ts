import { Router } from "express";
// import { authenticateJWT } from "../middleware/auth.middleware.js";
import {
  getExperiments,
  getExperimentWithId,
  postExperiments,
  putExperiments,
} from "../controllers/experiments_controller.js";
import { authenticateJWT } from "../middleware/auth_middleware.js";

const router = Router();

// router.get('/', getExperiments);
router.get("/", authenticateJWT, getExperiments);
router.get("/:experimentId", authenticateJWT, getExperimentWithId);
router.put("/:experimentId", authenticateJWT, putExperiments)
router.post("/", authenticateJWT, postExperiments);

export default router;
