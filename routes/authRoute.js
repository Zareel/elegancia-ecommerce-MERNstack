import express from "express";
import { signUpController } from "../controllers/authConroller.js";

//router object
const router = express.Router();

// routing
// signUp || method: post

router.post("/signup", signUpController);

export default router;
