import { Router } from "express";
import { getStatus } from "../controllers/result_controller.js";

const router = Router();

router.get("/status", getStatus);

export default router;
