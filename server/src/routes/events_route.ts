import { Router } from "express";
import { postEvents } from "../controllers/events_controller.js";

const router = Router();

router.post("/", postEvents);

export default router;
