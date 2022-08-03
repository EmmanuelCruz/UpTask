import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useProyecto from "../hooks/useProyecto"
import { Link } from "react-router-dom"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import Tarea from "../components/Tarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import Colaborador from "../components/Colaborador"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador"
import useAdmin from "../hooks/useAdmin"
import io from 'socket.io-client'

let socket;

const ProyectoId = () => {

  const params = useParams()
  const { cambiarEstadoTarea, actualizarTareaProyecto, obtenerProyecto, proyectoObtenido, cargando, handleModalFormularioTarea, alerta, submitTareasProyecto, eliminarTareaProyecto } = useProyecto()
  const admin = useAdmin()

  useEffect(() => {
    obtenerProyecto(params.id)
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND)
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND)
    socket.emit('abrir-proyecto', params.id)
  }, [])

  useEffect(() => {
    socket.on('tarea-agregada', (nuevaTarea) => {
      if(nuevaTarea.proyecto === proyectoObtenido._id){
        submitTareasProyecto(nuevaTarea)
      }
    })

    socket.on('tarea-eliminada', tareaEliminada => {
      if(tareaEliminada.proyecto === proyectoObtenido._id){
        eliminarTareaProyecto(tareaEliminada)
      }
    })

    socket.on('tarea-actualizada', tareaActualizada => {
      if(tareaActualizada.proyecto._id === proyectoObtenido._id){
        actualizarTareaProyecto(tareaActualizada)
      }
    })

    socket.on('estado-cambiado', tareaEstado => {
      if(tareaEstado.proyecto._id === proyectoObtenido._id){
        cambiarEstadoTarea(tareaEstado)
      }
    })
  })

  const { nombre } = proyectoObtenido
  const {msg} = alerta

  return (
    cargando ? 'Cargando...' : (
      <>
        <div className="flex justify-between">
          <h1 className="font-black text-4xl">{nombre}</h1>

          {admin && (
            <div className="flex items-center gap-2 text-gray-400 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>

              <Link to={`/proyectos/editar/${params.id}`}>Editar</Link>
            </div>
          )}


        </div>
        {admin && (
          <button
            type="button"
            onClick={() => handleModalFormularioTarea(true)}
            className="text-white justify-center flex gap-2 items-center hover:bg-sky-500 mt-3 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Nueva tarea
          </button>
        )}

        <p className="font-bold text-xl mt-10">Tareas el proyecto</p>

        <div className="bg-white shadow mt-10 rounded-lg">
          {proyectoObtenido.tareas?.length ? 
            proyectoObtenido.tareas.map(tarea => 
              (
                <Tarea key={tarea._id} tarea={tarea} />
              )
            ) :
            <p className="text-center my-5 p-10">No hay tareas</p>
          }
        </div>

        {admin && (
          <>
            <div className="flex items-center justify-between mt-10">
              <p className="font-bold text-xl">Colaboradores</p>
              <Link 
                to={`/proyectos/nuevo-colaborador/${proyectoObtenido._id}`} 
                className='text-gray-400 uppercase font-bold hover:text-black'
              >
                Añadir
              </Link>
            </div>

            <div className="bg-white shadow mt-10 rounded-lg">
              {proyectoObtenido.colaboradores?.length ? 
                proyectoObtenido.colaboradores.map(colaborador => 
                  (
                    <Colaborador key={colaborador.email} colaborador={colaborador} />
                  )
                ) :
                <p className="text-center my-5 p-10">No hay colaboradores en este proyecto</p>
              }
            </div>
          </>
        )}


        <ModalFormularioTarea />
        <ModalEliminarTarea />
        <ModalEliminarColaborador />

      </>
    )
  )
}

export default ProyectoId
