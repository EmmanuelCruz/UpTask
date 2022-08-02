import { useState } from "react"
import useProyecto from "../hooks/useProyecto"
import Alerta from "./Alerta"

const FormularioColaborador = () => {

  const [email, setEmail] = useState('')

  const { setAlerta, alerta, submitColaborador } = useProyecto()

  const handleSubmit = e => {
    e.preventDefault()

    if(email === ''){
      setAlerta({
        msg: 'El email es obligatorio',
        error: true
      })
      return
    }

    setAlerta({})
    submitColaborador(email)
  }

  const { msg } = alerta

  return (
    <form
      className='bg-white w-full py-10 px-5 md:w-2/3 rounded-lg shadow'
      onSubmit={handleSubmit}
    >
      {msg && <Alerta alerta={alerta} />}
      <div className='mb-5'>
        <label className='text-gray-700 uppercase font-bold text-sm' htmlFor="email">Email del colaborador</label>
        <input
          type="email"
          id='email'
          placeholder='Email del colaborador'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <input 
        className='bg-sky-600 hover:bg-sky-700 w-full p-3 uppercase text-white font-bold cursor-pointer transition-colors rounded' 
        value='Buscar colaborador'
        type="submit" />
    </form>
  )
}

export default FormularioColaborador
