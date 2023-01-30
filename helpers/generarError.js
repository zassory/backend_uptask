import { response } from "express";

const generarError = (mensaje,err) => {        
    const error = new Error(mensaje);
    return response.status(err).json({msg: error.message});
}

export default generarError;
