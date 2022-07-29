import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareasRoutes from './routes/tareasRoutes.js'
import cors from 'cors'

const app = express()
app.use(express.json()) // Para que pueda reconocer parámetros desde body
dotenv.config()
conectarDB()

// Configura cors
const whiteList = [process.env.BACKEND]
const corsOption = {
  origin: function(origin, callback) {
    if(whiteList.includes(origin)){
      callback(null, true)
    } else{
      callback(new Error('Error de cors'))
    }
  }
}
app.use(cors(corsOption))

// Routing
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes)
app.use("/api/tareas", tareasRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => 
  console.log(`Servidor corriendo en puerto ${PORT}`)
)
