import { response } from "express"
import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

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

    const { email , password } = req.body;

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({ msg: error.message });
    }
    
    //Comprobar si el usuario esya confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido activada, revisa tu correo");
        return res.status(403).json({ msg: error.message });
    }

    //Comprobar el pássword
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        });
    }else{  
        const error = new Error("El Password es Incorrecto");
        return res.status(403).json({msg: error.message});
    }
}

const confirm = async (req, res = response) => {
    console.log(req.params);
}

export {
    register,
    authenticate,
    confirm,
};