import { Router } from "express";

import {
  deleteVariants,
  getVariants,
  getVariantsWithExperimentId,
  postVariants,
} from "../controllers/variants_controller.js";

const router = Router();

router.get("/", getVariants);
router.get("/:experimentId", getVariantsWithExperimentId);
router.post("/", postVariants);
router.delete("/:experimentId", deleteVariants);
// router.get("/", authenticateJWT, getExperiments);
// router.get("/:experimentId", authenticateJWT, getExperimentWithId);
// router.put("/:experimentId", authenticateJWT, putExperiments);
// router.post("/", authenticateJWT, postExperiments);
// router.delete("/:experimentId", authenticateJWT, deleteExperiments);

export default router;
