import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteaxios from "../config/clienteAxios"

const Registrar = () => {

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secondPassword, setSecondPassword] = useState('')
  const [alerta, setAlerta] = useState({})
  
  const handleSubmit = async e => {
    e.preventDefault()

    if([nombre, email, password, secondPassword].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    if(password !== secondPassword){
      setAlerta({
        msg: 'Los passwords no coinciden',
        error: true
      })
      return
    }

    if(password.length < 6){
      setAlerta({
        msg: 'El password es muy corto. Agrega mínimo 6 caracteres',
        error: true
      })
      return
    }

    setAlerta({})

    // Se crea el usuario con la api
    try {
      const { data } = await clienteaxios.post(`/usuarios`, {
        nombre,
        password,
        email
      })

      setAlerta({
        msg: data.msg,
        error: false
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setSecondPassword('')
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
      <h1 className="text-sky-600 font-black text-6xl">Crea tu cuenta</h1>

      <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg px-10 py-5" action="">
        
        {msg && <Alerta alerta={alerta} />}
        
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="nombre">Nombre</label>
          <input
            type='text'
            id='nombre'
            placeholder='Nombre'
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Email</label>
          <input
            type='email'
            id='email'
            placeholder='Email de registro'
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="Password">Password</label>
          <input
            type='password'
            id='Password'
            placeholder='Password de registro'
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="newpassword">Confirma Password</label>
          <input
            type='password'
            id='newpassword'
            placeholder='Password de registro'
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={secondPassword}
            onChange={e => setSecondPassword(e.target.value)}
          />
        </div>

        <input 
          type='submit'
          value='Crear cuenta'
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

export default Registrar
