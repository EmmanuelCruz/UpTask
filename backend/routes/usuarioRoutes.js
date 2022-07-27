import express, { response } from 'express'
import { registrar, autenticar, confirmar, restablecerPassword, comprobarToken, nuevoPassword, perfil } from './../controllers/usuarioController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router()

router.post('/', registrar)
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/resetpassword', restablecerPassword)
router.route('/resetpassword/:token').get(comprobarToken).post(nuevoPassword)


router.get('/perfil', checkAuth, perfil)
export default router;