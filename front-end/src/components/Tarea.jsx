import React from 'react'
import { formatearFecha } from '../../helpers/formateaFecha'
import useProyecto from '../hooks/useProyecto'
import useAdmin from '../hooks/useAdmin'

const Tarea = ({tarea}) => {

  const {nombre, descripcion, prioridad, fechaEntrega, estado, _id } = tarea
  const { handleModalEditarTarea, handleEliminarTarea, completarTarea } = useProyecto()
  const admin = useAdmin()

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div>
        <p className='mb-1 text-xl'>{nombre}</p>
        <p className='mb-1 text-sm text-gray-500 uppercase'>{descripcion}</p>
        <p className='mb-1 text-sm'>Fecha de entrega: {formatearFecha(fechaEntrega)}</p>
        <p className='mb-1 text-xl text-gray-600'>Prioridad: {prioridad}</p>
        {estado && <p className='text-xs bg-green-600 uppercase p-1 rounded text-white text-center'>Completada por: {tarea.completado.nombre}</p>}
      </div>

      <div className='flex flex-col md:flex-row gap-2'>
        {admin && (
          <button
            className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
            onClick={() => handleModalEditarTarea(tarea)}
          >
            Editar
          </button>
        )}

        { estado ? (
          <button
            onClick={() => completarTarea(_id)}
            className='bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
          >
            Completa
          </button>
        ): (
          <button
            onClick={() => completarTarea(_id)}
            className='bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
          >
            Incompleta
          </button>
        )}

        {admin && (
          <button
            onClick={() => handleEliminarTarea(tarea)}
            className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
          >
            Eliminar
          </button>
        )}

      </div>
    </div>
  )
}

export default Tarea
