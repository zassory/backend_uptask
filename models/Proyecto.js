import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
   nombre: {
    type: String,
    trim: true,
    required:true,
   },
   descripcion: {
    type: String,
    trim: true,
    required: true,
   },
   fechaEntrega: {
    type: Date,
    default: Date.now(),
   },
   cliente: {
    type:String,
    trim:true,
    required:true,
   },
   creador:{
    
   }
});