import { Router } from "express";
import { login, register } from "../controllers/auth_controller.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

// console.log("👉 auth/resister router");

export default router;
