import mongoose from "mongoose";
import dotenv from "dotenv";

export const conectarDB = async() => {
    try{

        mongoose.set('strictQuery',false)
        const connection = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB Conectado en: ${url}`);

    }catch(error){
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
}

//export default conectarDB;