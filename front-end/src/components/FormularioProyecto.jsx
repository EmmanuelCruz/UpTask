import { useState } from "react"
import useProyecto from "../hooks/useProyecto"
import Alerta from "./Alerta"
import { useParams } from "react-router-dom"
import { useEffect } from "react"

const FormularioProyecto = () => {

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [cliente, setCliente] = useState('')

  const [id, setId] = useState(null)

  const params = useParams()
  const { setAlerta, alerta, submitProyecto, proyectoObtenido } = useProyecto()
  
  useEffect(() => {
    if(params.id && proyectoObtenido.nombre){
      // Editando
      setNombre(proyectoObtenido.nombre)
      setDescripcion(proyectoObtenido.descripcion)
      setFechaEntrega(proyectoObtenido.fecha.split('T')[0])
      setCliente(proyectoObtenido.cliente)
      setId(proyectoObtenido._id)
    }
  }, [params])

  const handleSubmit = async e => {
    e.preventDefault()

    if([nombre, descripcion, fechaEntrega, cliente].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })

      setTimeout(() => {
        setAlerta({})
      }, 3000);
      return
    }

    await submitProyecto({
      nombre, descripcion, fecha: fechaEntrega, cliente, id
    })

    setNombre('')
    setDescripcion('')
    setFechaEntrega('')
    setCliente('')
    setId(null)
  }

  const { msg } = alerta

  return (
    <form onSubmit={handleSubmit} className="bg-white py-10 px-5 md:w-3/4 rounded-lg shadow" action="">
      
      {msg && <Alerta alerta={alerta}/>}
      
      <div className="mt-5">
        <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="nombre">Nombre del proyecto</label>
        <input
          type="text"
          id='nombre'
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder='Nombre del proyecto'
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        />
      </div>

      <div className="mt-5">
        <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="descripcion">Descripcion del proyecto</label>
        <textarea
          id='descripcion'
          value={descripcion}
          placeholder='Descripción del proyecto'
          onChange={e => setDescripcion(e.target.value)}
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        />
      </div>

      <div className="mt-5">
        <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="fecha">Fecha de entrega</label>
        <input
          type="date"
          id='fecha'
          value={fechaEntrega}
          onChange={e => setFechaEntrega(e.target.value)}
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        />
      </div>

      <div className="mt-5">
        <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="cliente">cliente del cliente</label>
        <input
          type="text"
          id='cliente'
          value={cliente}
          onChange={e => setCliente(e.target.value)}
          placeholder='Nombre del cliente'
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
        />
      </div>

      <input className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 mt-5" type="submit" value={`${id ? 'Actualizar proyecto': 'Crear proyecto'}`} />
    </form>
  )
}

export default FormularioProyecto
