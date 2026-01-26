import { Router } from "express";
import {
  deleteExperiments,
  getExperiments,
  getExperimentId,
  postExperiments,
  putExperiments,
} from "../controllers/experiments_controller.js";
import { authenticateJWT } from "../middleware/auth_middleware.js";

const router = Router();

router.get("/", authenticateJWT, getExperiments);
router.get("/:experimentId", authenticateJWT, getExperimentId);
router.put("/:experimentId", authenticateJWT, putExperiments);
router.post("/", authenticateJWT, postExperiments);
router.delete("/:experimentId", authenticateJWT, deleteExperiments);

export default router;
