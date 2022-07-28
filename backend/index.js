import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareasRoutes from './routes/tareasRoutes.js'

const app = express()
app.use(express.json()) // Para que pueda reconocer parámetros desde body
dotenv.config()
conectarDB()

// Routing
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes)
app.use("/api/tareas", tareasRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => 
  console.log(`Servidor corriendo en puerto ${PORT}`)
)
