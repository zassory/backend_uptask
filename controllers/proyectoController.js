import { request , response } from "express";
import Proyecto from "../models/Proyecto.js";
import mongoose from "mongoose";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async(req = request,res = response) => {

    try{
        const proyectos = await Proyecto.find({
            '$or': [
                {colaboradores: {$in: req.usuario}},
                {creador: {$in: req.usuario}},
            ],
        })//.where("creador").equals(req.usuario)
        .select('-tareas');
        res.status(200).json(proyectos);
    } catch(err){
        const error = new Error('Accion no valida');
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
    const proyecto = await Proyecto.findById(id)
        .populate("tareas")
        .populate("colaboradores", "nombre email");

    if(!proyecto){
        const error = new Error("No Encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.
    colaboradores.some( colaborador => colaborador._id.toString() === req.usuario._id.toString() ) ){
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

const buscarColaborador = async(req = request,res = response) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if(!usuario){
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({msg: error.message});
    }

    res.json(usuario);
}

const agregarColaborador = async(req = request,res = response) => {
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto){
        const error = new Error("Proyecto No Encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("Acción no Válida");
        return res.status(404).json({msg: error.message});
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if(!usuario){
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({msg: error.message});
    }

    // El colaborador no es el admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString() ){
        const error = new Error("El Creador del Proyecto no puede ser colaborador");
        return res.status(404).json({msg: error.message});
    }

    // Revisar que no este ya agregado el proyecto

    if(proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("El Usuario ya pertenece al Proyecto");
        return res.status(404).json({msg: error.message});
    }

    //Esta bien, se puede agregar
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({msg: "Colaborador Agregado Correctamente"});    
}

const eliminarColaborador = async(req = request,res = response) => {
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto){
        const error = new Error("Proyecto No Encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString() ){
        const error = new Error("Acción no Válida");
        return res.status(404).json({msg: error.message});
    }

    //Esta bien, se puede eliminar
    proyecto.colaboradores.pull(req.body.id);
    
    await proyecto.save();
    res.json({msg: "Colaborador Eliminado Correctamente"});
}

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
}
