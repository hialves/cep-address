import { AddressController } from '@controllers/index'
import express from 'express'

const addressRoutes = express.Router()

addressRoutes.get('/addresses', AddressController.findAll)
addressRoutes.get('/address/:id', AddressController.findById)
addressRoutes.get('/address/find-by-cep/:cep', AddressController.findByCep)
addressRoutes.get(
  '/address/find-by-key/:key/:search',
  AddressController.findByKey,
)
addressRoutes.post('/address/find-by-text', AddressController.findByTextFilter)
addressRoutes.post('/address', AddressController.create)
addressRoutes.put('/address/:id', AddressController.update)
addressRoutes.delete('/address/:id', AddressController.delete)

export default addressRoutes
