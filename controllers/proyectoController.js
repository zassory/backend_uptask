import { request , response } from "express";
import Proyecto from "../models/Proyecto.js";
import mongoose from "mongoose";
import Tarea from "../models/Tarea.js";
//import generarError from "../helpers/generarError.js";

const obtenerProyectos = async(req = request,res = response) => {

    try{
        const proyectos = await Proyecto.find().where("creador").equals(req.usuario);
        res.status(200).json(proyectos);
    } catch(err){
        const error = new Error('Accion no v{alida');
        return res.status(404).json({msg: error.message});
    }
    
}

const nuevoProyecto = async(req = request,res = response) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try{
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    }catch(error){
        console.log(error);
    }
};

const obtenerProyecto = async(req = request,res = response) => {
    const { id } = req.params;

    const valid = mongoose.Types.ObjectId.isValid(id);

    if(!valid){
        const error = new Error('Id no válido');
        return res.status(404).json({msg: error.message});
        //const err = generarError('Id no válido',404);
        //return err;
    }
    
    //try{
        const proyecto = await Proyecto.findById(id);

    if(!proyecto){
        const error = new Error("No Encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("Acción No Válida");
        return res.status(401).json({ msg: error.message });
    }

    // Obtener las tareas del proyecto
    //const tareas = await Tarea.find().where("proyecto").equals(proyecto.id);
    res.json(
        proyecto,
        //
    );
        
    //} catch(err){        
    //    return res.status(404).json({ msg: "Id no válido"});
    //};
}

const editarProyecto = async(req = request,res = response) => {
    const { id } = req.params;

    const valid = mongoose.Types.ObjectId.isValid(id);
    if(!valid){
        const error = new Error('Id no válido');
        return res.status(404).json({msg: error.message});
    }

    const proyecto = await Proyecto.findById(id);
    if(!proyecto){
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("Acción no Válida");
        return res.status(401).json({ msg: error.message });
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = req.body.cliente || proyecto.cliente;

    try{
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    }catch(error){
        console.log(error);
    }
}

const eliminarProyecto = async(req = request,res = response) => {
    const { id } = req.params;
    const valid = mongoose.Types.ObjectId.isValid(id);
    if(!valid){
        const error = new Error('Id no válido');
        return res.status(404).json({msg:error.message});
    }
    const proyecto = await Proyecto.findById(id);
    if(!proyecto){
        const error = new Error("No encontrado");
        return res.status(404).json({msg: error.message});
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("Acción no Válida");
        return res.status(401).json({ msg: error.message });
    }

    try{
        await proyecto.deleteOne();
        res.json({msg: "Proyecto Eliminado"});
    }catch(err){
        //const error = new Error('Acción no válida');
        //res.status(404).json({msg:error.message});
        console.log(error);
    }
}

const agregarColaborador = async(req = request,res = response) => {

}

const eliminarColaborador = async(req = request,res = response) => {

}

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
}
