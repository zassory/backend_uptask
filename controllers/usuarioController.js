import { response } from "express"
import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";

const register = async (req,res=response) => {

    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });

    if(existeUsuario){
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({msg: error.message});
    }

    try{
        const usuario = new Usuario(req.body);
        usuario.token = generarId();
        const usuarioAlmacenado = await usuario.save()
        res.json(usuarioAlmacenado);

    }catch(error){
        console.log(error);
    }    
}

const authenticate = async (req , res = response) => {
    
}

export {
    register,
    authenticate,
};