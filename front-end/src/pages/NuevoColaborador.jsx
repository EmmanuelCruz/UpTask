import { useEffect } from "react"
import FormularioColaborador from "../components/FormularioColaborador"
import useProyecto from "../hooks/useProyecto"
import { useParams } from "react-router-dom"
import Alerta from "../components/Alerta"

const NuevoColaborador = () => {

  const { obtenerProyecto, proyectoObtenido, cargando, colaborador, agregarColaborador, alerta } = useProyecto()
  const params = useParams()

  useEffect(() => {
    obtenerProyecto(params.id)
  }, [])

  if(cargando) {
    return 'Cargando...'
  }

  const { msg } = alerta

  if(!proyectoObtenido?._id) return <Alerta alerta={alerta}/>

  return (
    <>
      <h1 className='text-4xl font-black'>Añadir colaborador al proyecto {proyectoObtenido.nombre}</h1>

      <div className='mt-10 flex justify-center'>
        <FormularioColaborador />
      </div>

      {cargando ? 'Cargando...' : colaborador?._id && (
        <div className="flex justify-center mt-10">
          <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
            <h2 className="text-center mb-10 text-2xl font-bold">Resultado</h2>
            <div className="flex gap-5 justify-center items-center">
              <p>{colaborador.nombre}</p>
              <button 
                type="button"
                onClick={() => agregarColaborador({
                  email: colaborador.email
                })}
                className="bg-slate-500 hover:bg-slate-600 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
              >
                Agregar al proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NuevoColaborador
