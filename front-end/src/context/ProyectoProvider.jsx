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
  const [colaborador, setColaborador] = useState({})
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
  const [buscador, setBuscador] = useState(false)

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
      navigate('/proyectos')
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
    setAlerta({})
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

  const submitColaborador = async email => {
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

      const { data } = await clienteaxios.post('/proyectos/colaboradores', {email}, config)
      setColaborador(data)
      setAlerta({})

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    } finally {
      setCargando(false)
    }
  }

  const agregarColaborador = async email   => {
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

      const { data } = await clienteaxios.post(`/proyectos/colaboradores/${proyectoObtenido._id}`, email, config)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})

      setTimeout(() => {
        setAlerta({})
      }, 3000);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      console.log(error)
    }
  }

  const handleEliminarColaborador = colaborador => {
    setModalEliminarColaborador(!modalEliminarColaborador)
    setColaborador(colaborador)
  }

  const eliminarColaborador = async () => {
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

      const { data } = await clienteaxios.post(`/proyectos/eliminar-colaborador/${proyectoObtenido._id}`, { id: colaborador._id}, config)

      const proyectoActualizado = {...proyectoObtenido}
      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colab => colab._id !== colaborador._id)

      setProyectoObtenido(proyectoActualizado)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})
      setModalEliminarColaborador(false)

      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } catch (error) {
      console.error(error)
    }
  }

  const completarTarea = async id => {
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

      const { data } = await clienteaxios.post(`/tareas/estado/${id}`, {}, config)

      const proyectoActualizado = {...proyectoObtenido}
      proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaS => tareaS._id === data._id ? data : tareaS )
      setProyectoObtenido(proyectoActualizado)
      setTarea({})

    } catch (error) {
      console.log(error)
    }
  } 

  const handleBuscador = () => {
    setBuscador(!buscador)
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
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador
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