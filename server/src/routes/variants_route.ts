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

export default router;
