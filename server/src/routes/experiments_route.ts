import { Router } from "express";
import { getExperiments } from "../controllers/experiments_controller.js";

const router = Router();

router.get('/', getExperiments);

export default router;