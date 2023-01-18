import express from "express";
import { response } from "express";
const router = express.Router();//Esto lo da express

router.get("/", (req,res = response) => {
    res.send("Desde API/USUARIOS");
});



export default router;