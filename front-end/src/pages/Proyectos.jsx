import useProyecto from "../hooks/useProyecto"
import Proyecto from "../components/Proyecto"
import Alerta from "../components/Alerta"

const Proyectos = () => {
  const { proyecto, alerta } = useProyecto()

  const { msg } = alerta

  return (
    <>
      <h1 className="text-4xl font-black">Proyectos</h1>

      {msg && <Alerta alerta={alerta} />}

      <div className="bg-white shadow mt-10 rounded-lg p-5">
        {proyecto.length ? 
          proyecto.map(p => (
            <Proyecto key={p._id} proyecto={p}/>
          ))
        : <p className="text-center text-gray-600 uppercase font-bold p-5">No hay proyectos</p>}
      </div>
    </>
  )
}

export default Proyectos
