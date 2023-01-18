import express from "express";
const router = express.Router();//Esto lo da express
import { register } from "../controllers/usuarioController.js";

//Autenticated,Create, Add and Confirm users
router.post("/",register);

export default router;