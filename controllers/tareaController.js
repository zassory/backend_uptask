import { response , request } from "express";
import mongoose from "mongoose";
import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async(req = request , res = response ) => {
    const { proyecto } = req.body;

    const valid = mongoose.Types.ObjectId.isValid(proyecto);
    if(!valid){
        const error = new Error("Id no válido");
        return res.status(404).json({ mdg: error.message});
    }

    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
        const error = new Error('El Proyecto no existe');
        return res.status(404).json({msg: error.message});
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("No tienes los permisos para añadir tareas");
        return res.status(404).json({msg: error.message});
    }

    try{
        const tareaAlmacenada = await Tarea.create(req.body);
        res.json(tareaAlmacenada);
    }catch(error){
        console.log(error);
    }
    
}

const obtenerTarea = async(req = request , res = response ) => {
    
}

const actualizarTarea = async(req = request , res = response ) => {
    
}

const eliminarTarea = async(req = request , res = response ) => {
    
}

const cambiarEstado = async(req = request , res = response ) => {
    
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
}