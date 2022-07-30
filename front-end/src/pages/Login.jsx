import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteaxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const { setAuth } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    if([email, password].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    try {
      const { data } = await clienteaxios.post('/usuarios/login', {
        email,
        password
      })

      localStorage.setItem("token", data.token)
      setAlerta({})
      setAuth(data)
      navigate('/proyectos')
      window.location.reload()
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Inicia sesión</h1>

      <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg px-10 py-5" action="">

        {msg && <Alerta alerta={alerta}/>}

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

        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Password</label>
          <input
            type='Password'
            id='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Password de registro'
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <input 
          type='submit'
          value='Iniciar sesión'
          className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          to='registrar'
          className="block text-center my-5 text-slate-700 uppercase text-sm"
        >
          ¿No tienes una cuenta? Registrate
        </Link>

        <Link
          to='olvide-password'
          className="block text-center my-5 text-slate-700 uppercase text-sm"
        >
          Olvidé mi password
        </Link>
      </nav>
    </>
  )
}

export default Login
