import { AddressController } from '@controllers/index'
import express from 'express'

const addressRoutes = express.Router()

addressRoutes.get('/address/:uf/:city/:complement', AddressController.find)

export default addressRoutes
