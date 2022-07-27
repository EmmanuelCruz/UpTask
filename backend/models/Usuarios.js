import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const usuarioShcema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    token: {
      type: String
    },
    confirmado: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

usuarioShcema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

usuarioShcema.methods.comprobarPassword = async function(pass){
  try {
    return await bcrypt.compare(pass, this.password)
  } catch (error) {
    console.error(error)
  }
}

const Usuario = mongoose.model("Usuario", usuarioShcema)

export default Usuario