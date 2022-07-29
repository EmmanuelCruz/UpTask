import React from 'react'

const Alerta = ({alerta}) => {
  return (
    <div className={`${alerta.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'} text-center p-3 rounded-xl text-white m-10 font-bold bg-gradient-to-br`}>
      {alerta.msg}
    </div>
  )
}

export default Alerta
