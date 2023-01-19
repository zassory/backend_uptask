import { response } from "express"
import Usuario from "../models/Usuario.js";

const register = async (req,res=response) => {

    try{
        const usuario = new Usuario(req.body);        
        const usuarioAlmacenado = await usuario.save()
        res.json(usuarioAlmacenado);

    }catch(error){
        console.log(error);
    }    
}

export {
    register,    
};