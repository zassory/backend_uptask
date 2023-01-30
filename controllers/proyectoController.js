import { request , response } from "express";
import Proyecto from "../models/Proyecto.js";

const obtenerProyectos = async(req = request,res = response) => {

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

}

const editarProyecto = async(req = request,res = response) => {

}

const eliminarProyecto = async(req = request,res = response) => {

}

const agregarColaborador = async(req = request,res = response) => {

}

const eliminarColaborador = async(req = request,res = response) => {

}

const obtenerTareas = async(req = request,res = response) => {

}

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas,
}
