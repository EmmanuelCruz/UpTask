import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tareas.js"

const obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.find().where('creador').equals(req.usuario)
  res.json(proyectos)
}

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario._id

  try {
    const proyectoAlmacenado = await proyecto.save()
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.error(error);
  }
}

const obtenerProyecto = async (req, res) => {
  const { id } = req.params

  const proyecto = await Proyecto.findById(id)

  if(!proyecto){
    const error = new Error('No encontrado')
    return res.status(404).json({msg: error.message})
  }

  // Se restringe a acceder a proyecto solo del usuario loggeado
  if(proyecto.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('Acción inválida')
    return res.status(404).json({msg: error.message})
  }

  // Se obtienen tareas del proyecto
  const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)

  res.json({
    proyecto,
    tareas
  })
}

const editarProyecto = async (req, res) => {
  const { id } = req.params

  const proyecto = await Proyecto.findById(id)

  if(!proyecto){
    const error = new Error('No encontrado')
    return res.status(404).json({msg: error.message})
  }

  // Se restringe a acceder a proyecto solo del usuario loggeado
  if(proyecto.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('Acción inválida')
    return res.status(404).json({msg: error.message})
  }

  proyecto.nombre = req.body.nombre || proyecto.nombre
  proyecto.descripcion = req.body.descripcion || proyecto.descripcion
  proyecto.fecha = req.body.fecha || proyecto.fecha
  proyecto.cliente = req.body.cliente || proyecto.cliente

  try {
    const proyectoAlmacenado = await proyecto.save()
    res.json(proyectoAlmacenado)
  } catch (error) {
    console.error(error);
  }
  
}

const eliminarProyecto = async (req, res) => {
  const { id } = req.params

  const proyecto = await Proyecto.findById(id)

  if(!proyecto){
    const error = new Error('No encontrado')
    return res.status(404).json({msg: error.message})
  }

  // Se restringe a acceder a proyecto solo del usuario loggeado
  if(proyecto.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('Acción inválida')
    return res.status(404).json({msg: error.message})
  }

  try {
    await proyecto.deleteOne()
    res.json({msg: 'Proyecto eliminado'})
  } catch (error) {
    console.error(error);
  }
}

const agregarColaborador = async (req, res) => {

}

const eliminarColaborador = async (req, res) => {

}

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador
}