import useProyecto from "./useProyecto";
import useAuth from "./useAuth";

const useAdmin = () => {
  const { proyectoObtenido } = useProyecto()
  const { auth } = useAuth()

  return proyectoObtenido.creador === auth._id
}

export default useAdmin