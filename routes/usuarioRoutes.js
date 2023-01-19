import express from "express";
const router = express.Router();//Esto lo da express
import { 
    register , 
    authenticate , 
    confirm , 
    olvidePassword ,
    comprobarToken } from "../controllers/usuarioController.js";

//Autenticated,Create, Add and Confirm users
router.post("/",register);
router.post("/login",authenticate);
router.get("/confirmar/:token", confirm);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token", comprobarToken);

export default router;