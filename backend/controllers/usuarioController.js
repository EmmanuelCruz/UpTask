import Usuario from '../models/Usuarios.js'
import generarId from '../helpers/generarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const registrar = async (req, res) => {
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({
    email
  })

  if(existeUsuario){
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({msg: error.message})
  }
  try {
    const usuario = new Usuario(req.body)
    usuario.token = generarId()
    await usuario.save()

    // Enviar email de confirmacion
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    })
    res.json({msg: 'Usuario creado correctamente. Revisa tu email para confirmar'})
  } catch (error) {
    console.error(error)
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body
  
  // Comprobar que el usuario exista
  const usuario = await Usuario.findOne({email})
  if(!usuario){
    const error = new Error('El usuario no existe')
    return res.status(404).json({msg: error.message})
  }

  // Verificar confirmación del usuario
  if(!usuario.confirmado){
    const error = new Error('El usuario no está confirmado')
    return res.status(403).json({msg: error.message})
  }

  // Comprobar password
  if(await usuario.comprobarPassword(password)){
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id)
    })
  } else {
    const error = new Error('El password es incorrecto')
    return res.status(403).json({msg: error.message})
  }
}

const confirmar = async (req, res) => {
  const { token } = req.params
  const usuarioAConfirmar = await Usuario.findOne({token})

  if(!usuarioAConfirmar){
    const error = new Error('Token inválido')
    return res.status(403).json({msg: error.message})
  }

  try {
    usuarioAConfirmar.confirmado = true
    usuarioAConfirmar.token = ''
    await usuarioAConfirmar.save()
    res.json({msg: 'Usuario confirmado correctamente'})
  } catch (error) {
    console.error(error);
  }

}

const restablecerPassword = async (req, res) => {
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({
    email
  })

  if(!existeUsuario){
    const error = new Error('El usuario no existe')
    return res.status(400).json({msg: error.message})
  }

  try {
    existeUsuario.token = generarId()
    await existeUsuario.save()
    
    // Enviar email de confirmacion
    emailOlvidePassword({
      nombre: existeUsuario.nombre,
      email: existeUsuario.email,
      token: existeUsuario.token
    })

    res.json({msg: 'Se ha enviado un email con las instrucciones'})
  } catch (error) {
    console.error(error);
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params

  const tokenValido = await Usuario.findOne({token})

  if(tokenValido) {
    res.json({msg: 'Token valido'})
  } else {
    const error = new Error('Token inválido')
    return res.status(400).json({msg: error.message})
  }
}

const nuevoPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const usuario = await Usuario.findOne({token})

  if(usuario){
    usuario.password = password
    usuario.token = ''
    try {
      await usuario.save()
      res.json({msg: 'Usuario modificado correctamente'})
    } catch (error) {
      console.error(error);
    }
  } else{
    const error = new Error('El usuario no existe')
    return res.status(400).json({msg: error.message})
  }
}

const perfil = async (req, res) => {
  const { usuario } = req

  res.json(usuario)
}

export {
  registrar,
  autenticar,
  confirmar,
  restablecerPassword,
  comprobarToken,
  nuevoPassword,
  perfil
}