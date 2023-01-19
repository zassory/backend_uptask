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
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({token});

    if(!usuarioConfirmar){
        const error = new Error("Token no válido");
        return res.status(403).json({ msg: error.message });
    }
    try{
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg: "Usuario Confirmado Correctamente"});
    }catch(error){
        console.log(error);
    }
};

const olvidePassword = async (req, res = response) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if(!usuario){
        const error = new Error("El usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    try{
        usuario.token = generarId();
        await usuario.save();
        res.json({msg: "Hemos enviado un email con las instrucciones"});
    }catch(error){
        console.log(error);
    }
    
};

export {
    register,
    authenticate,
    confirm,
    olvidePassword,
};