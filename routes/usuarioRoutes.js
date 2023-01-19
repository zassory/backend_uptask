import express from "express";
const router = express.Router();//Esto lo da express
import { register , authenticate } from "../controllers/usuarioController.js";

//Autenticated,Create, Add and Confirm users
router.post("/",register);
router.post("/login",authenticate)

export default router;