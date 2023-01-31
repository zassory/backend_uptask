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
    const { id } = req.params;

    const valid = mongoose.Types.ObjectId.isValid(id);
    if(!valid){
        const error = new Error("Id no válido");
        return res.status(404).json({msg:error.message});
    }
    
    const tarea = await Tarea.findById(id).populate("proyecto");
    if(!tarea){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg: error.message});
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("Acción no válida");
        return res.status(403).json({msg: error.message});
    }

    res.json(tarea);
}

const actualizarTarea = async(req = request , res = response ) => {
    const { id } = req.params;

    const valid = mongoose.Types.ObjectId.isValid(id);
    if(!valid){
        const error = new Error("Id no válido");
        return res.status(404).json({msg:error.message});
    }
 
    const tarea = await Tarea.findById(id).populate("proyecto");
    if(!tarea){
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({msg:error.message});
    }
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("Acción no válida");
        return res.status(403).json({msg: error.message});
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

    try{
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada);
    }catch(error){
        console.log(error);
    }
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