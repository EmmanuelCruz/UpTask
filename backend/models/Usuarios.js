import mongoose from "mongoose";

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

const Usuario = mongoose.model("Usuario", usuarioShcema)

export default Usuario