import express from "express";
const router = express.Router();//Esto lo da express
import { 
    register ,
    authenticate ,
    confirm ,
    olvidePassword ,
    comprobarToken ,
    nuevoPassword ,
    perfil,
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";

//Autenticated,Create, Add and Confirm users
router.post("/",register);
router.post("/login",authenticate);
router.get("/confirmar/:token", confirm);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get('/perfil',checkAuth,perfil);

export default router;