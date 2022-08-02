import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Proyecto = ({proyecto}) => {

  const { auth } = useAuth()

  const { nombre, _id, cliente, creador } = proyecto

  return (
    <div className="border-b p-5 flex flex-col md:flex-row justify-between">

      <div className="flex items-center gap-2">
        <p className="flex-1">
          {nombre}
          <span className="text-sm text-gray-500 uppercase"> {cliente}</span>
        </p>
        {auth._id !== creador && (
          <p className="p-1 text-xs rounded text-white bg-green-500 uppercase font-bold">Colaborador</p>
        )}
      </div>

      <Link
        to={`/proyectos/${_id}`}
        className='text-gray-600 hover:text-gray-800 font-bold uppercase text-sm'
      >
        Ver proyecto
      </Link>
    </div>
  )
}

export default Proyecto
