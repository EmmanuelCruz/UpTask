import axios from "axios";

const clienteaxios = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND}/api`
})

export default clienteaxios