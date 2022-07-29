import Alerta from '../components/Alerta';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import clienteaxios from '../config/clienteAxios';

const ConfirmarCuenta = () => {

  const { id } = useParams()
  const [alerta, setAlerta] = useState({})
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

  useState(()=>{
    const confirmaToken = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteaxios(url)
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
    confirmaToken()
  }, [])

  const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Confirma tu cuenta</h1>

      {msg && <Alerta alerta={alerta}/>}

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

export default ConfirmarCuenta
