import { useState, createContext, useEffect } from "react";
import clienteaxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";

const ProyectoContext = createContext()

const ProyectoProvider = ({ children }) => {

  const [proyecto, setProyecto] = useState([])
  const [alerta, setAlerta] = useState({})
  const [proyectoObtenido, setProyectoObtenido] = useState({})
  const [cargando, setCargando] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const obtenerProyectos = async () => {
      console.log("Entra a obtener")
      try {
        const token = localStorage.getItem('token')
        console.log(token)
        if (!token) {
          return
        }

        console.log("Sí pasa")

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

    console.log("Entra a obtener")

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
      setProyecto(nuevosProyectos )

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
        eliminarProyecto
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