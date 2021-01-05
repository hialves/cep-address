import { CepController } from '@controllers/index'
import express from 'express'

const cepRoutes = express.Router()

cepRoutes.get('/cep/:cep', CepController.find)

export default cepRoutes
