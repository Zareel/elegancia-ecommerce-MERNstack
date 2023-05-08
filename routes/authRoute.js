import express from "express";
import { signUp, login } from "../controllers/authConroller.js";

//router object
const router = express.Router();

// routing
// signUp || method: post
router.post("/signup", signUp);

//login || POST
router.post("/login", login);

export default router;
