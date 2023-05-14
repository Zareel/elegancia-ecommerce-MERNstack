import express from "express";
import { signUp, login, testController } from "../controllers/authConroller.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

//router object
const router = express.Router();

// routing
// signUp || method: post
router.post("/signup", signUp);

//login || POST
router.post("/login", login);

//test || get
router.get("/test", requireSignIn, isAdmin, testController);
export default router;
