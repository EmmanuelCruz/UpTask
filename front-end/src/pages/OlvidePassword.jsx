import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteaxios from "../config/clienteAxios"

const OlvidePassword = () => {

  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()

    if(email === '' || email.length < 6){
      setAlerta({
        msg: 'El email es obligatorio',
        error: true
      })
      return
    }

    try {
      const { data } = await clienteaxios.post(`/usuarios/resetpassword`, {
        email
      })

      setAlerta({
        msg: data.msg,
        error: false
      })

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const {msg} = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Recupera tu acceso</h1>

      <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg px-10 py-5" action="">
        {
          msg && 
          <Alerta alerta={alerta} />
        }

        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Email</label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            id='email'
            placeholder='Email de registro'
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <input 
          type='submit'
          value='Enviar instrucciones'
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          to='/'
          className="block text-center my-5 text-slate-700 uppercase text-sm"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </nav>
    </>
  )
}

export default OlvidePassword
