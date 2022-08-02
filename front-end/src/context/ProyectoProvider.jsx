import { useState, createContext, useEffect } from "react";
import clienteaxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";

const ProyectoContext = createContext()

const ProyectoProvider = ({ children }) => {

  const [proyecto, setProyecto] = useState([])
  const [alerta, setAlerta] = useState({})
  const [proyectoObtenido, setProyectoObtenido] = useState({})
  const [cargando, setCargando] = useState(false)
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
  const [tarea, setTarea] = useState({})
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          return
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }

        const { data } = await clienteaxios('/proyectos', config)

        setProyecto(data)
      } catch (error) {
        console.error(error);
      }
    }

    obtenerProyectos()
  }, [])

  const submitProyecto = async proyectoNuevo => {

    if (proyectoNuevo.id) {
      // Editando
      await editarProyecto(proyectoNuevo)
    } else {
      // Creando nuevo
      await crearProyecto(proyectoNuevo)
    }
  }

  const eliminarProyecto = async id => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteaxios.delete(`/proyectos/${id}`, config)

      const nuevosProyectos = proyecto.filter(pActual => pActual._id !== id)
      setProyecto(nuevosProyectos)

      setAlerta({
        msg: 'Proyecto eliminado correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  }

  const editarProyecto = async proyecto2 => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteaxios.put(`/proyectos/${proyecto2.id}`, proyecto2, config)

      const nuevosProyectos = proyecto.map(proyectoActual => proyectoActual._id === data._id ? data : proyectoActual)
      setProyecto(nuevosProyectos)

      setAlerta({
        msg: 'Proyecto actualizado correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  const crearProyecto = async proyectoNuevo => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteaxios.post('/proyectos', proyectoNuevo, config)

      setProyecto([...proyecto, data])

      setAlerta({
        msg: 'Proyecto creado correctamente',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);
    } catch (error) {
      console.error(error)
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const obtenerProyecto = async id => {
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteaxios(`/proyectos/${id}`, config)
      setProyectoObtenido(data.proyecto)

    } catch (error) {

    } finally {
      setCargando(false)
    }
  }

  const submitTarea = async tarea => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      if (tarea.id) {
        // Editar
        const { data } = await clienteaxios.put(`/tareas/${tarea.id}`, tarea, config)

        const proyectoActualizado = { ...proyectoObtenido }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data : tareaState)
        setProyectoObtenido(proyectoActualizado)
      } else {
        // Crear nueva
        const { data } = await clienteaxios.post('/tareas', tarea, config)

        // Agregar una copia de la tarea en el state
        const proyectoActualizado = { ...proyectoObtenido }
        proyectoActualizado.tareas = [...proyectoObtenido.tareas, data]
        setProyectoObtenido(proyectoActualizado)
      }

      setModalFormularioTarea(false)
    } catch (error) {
      console.error(error);
    }
  }

  const handleModalEditarTarea = tarea => {
    setTarea(tarea)
    setModalFormularioTarea(true)
  }

  const handleModalFormularioTarea = modal => {
    setModalFormularioTarea(modal)
    setTarea({})
  }

  const handleEliminarTarea = tarea => {
    setModalEliminarTarea(!modalEliminarTarea)
    setTarea(tarea)
  }

  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      const { data } = await clienteaxios.delete(`/tareas/${tarea._id}`, config)
      setAlerta({
        msg: data.msg,
        error: false
      })
      const proyectoActualizado = { ...proyectoObtenido }
      proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
      setProyectoObtenido(proyectoActualizado)
      setModalEliminarTarea(false)
      setTarea({})
      setTimeout(() => {
        setAlerta({})
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ProyectoContext.Provider
      value={{
        proyecto,
        setAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyectoObtenido,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalFormularioTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleEliminarTarea,
        eliminarTarea
      }}
    >
      {children}
    </ProyectoContext.Provider>
  )
}

export {
  ProyectoProvider
}

export default ProyectoContext