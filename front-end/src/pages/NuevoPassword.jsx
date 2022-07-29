import { Link, useParams } from "react-router-dom"
import Alerta from "../components/Alerta"
import { useEffect, useState } from "react"
import clienteaxios from "../config/clienteAxios"

const NuevoPassword = () => {

  const params = useParams()
  const { token } = params
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState({})
  const [password, setPassword] = useState('')
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

  useEffect(() => {
    const comprobarToken =async () => {
      try {
        await clienteaxios(`/usuarios/resetpassword/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    comprobarToken()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    if(password.length < 6){
      setAlerta({
        msg: 'El password debe ser de mínimo 6 caracteres',
        error: true
      })
      return
    }

    try {
      const url = `/usuarios/resetpassword/${token}`
      const { data } = await clienteaxios.post(url, {
        password
      })
      setAlerta({
        msg: data.msg,
        error: false
      })
      setCuentaConfirmada(true)
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
      <h1 className="text-sky-600 font-black text-6xl">Restablece tu password</h1>

      {
        msg && (
          <Alerta alerta={alerta}/>
        )
      }

      {
        tokenValido && !cuentaConfirmada && (
          <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg px-10 py-5" action="">

            <div className="my-5">
              <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="Password">Nuevo Password</label>
              <input
                type='password'
                id='Password'
                placeholder='Escribe tu nuevo password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              />
            </div>

            <input 
              type='submit'
              value='Guardar nuevo password'
              className="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
            />
          </form>
        )
      }
      
      {cuentaConfirmada && (
        <Link
          to='/'
          className="block text-center my-5 text-slate-700 uppercase text-sm"
        >
          Inicia sesión
        </Link>
      )
      }
    </>
  )
}

export default NuevoPassword
