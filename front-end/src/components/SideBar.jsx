import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const SideBar = () => {

  const { auth } = useAuth()

  return (
    <aside className='md:w-80 lg:w-96 px-5 py-10'>
      <p className='text-xl font-bold'>Hola {auth.nombre}</p>

      <Link className='bg-sky-600 w-full hover:bg-sky-700 p-3 text-white uppercase font-bold block mt-5 text-center rounded-lg' to='nuevo-proyecto'>Nuevo proyecto</Link>
    </aside>
  )
}

export default SideBar
