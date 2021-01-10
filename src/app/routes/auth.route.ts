import { AuthController } from '@controllers/index'
import express from 'express'

const authRoutes = express.Router()

authRoutes.post('/admin-login', AuthController.login)

export default authRoutes
