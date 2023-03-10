import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { conectarDB } from "./config/db.js"
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

dotenv.config();

conectarDB();

//Configurar cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin,callback){
        if(whitelist.includes(origin)){
            //Puede consultar la api
            callback(null, true);
        }else{
            //No esta permitido su request
            callback(new Error('Error de CORS'));
        }
    }
};

app.use(cors(corsOptions));

// Routing
app.use("/api/usuarios",usuarioRoutes);
app.use("/api/proyectos",proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io
import { Server } from 'socket.io';

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
});

io.on("connection", (socket) => {
    console.log("Conectado a socket.io");

   //Definir los eventos de socket io
   socket.on("abrir proyecto", (proyecto) => {        
        socket.join(proyecto);        
   });

   socket.on("nueva tarea" , tarea => {        
        socket.to(tarea.proyecto).emit('tarea agregada', tarea);        
   })
});