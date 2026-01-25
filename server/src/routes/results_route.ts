import { Router } from "express";
import { getStatus } from "../controllers/result_controller.js";

const router = Router();

router.get("/", getStatus);

export default router;
