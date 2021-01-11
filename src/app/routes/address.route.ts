import { AddressController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import AddressValidator from 'app/validators/controller/address.validator'
import express from 'express'

const addressRoutes = express.Router()

addressRoutes.get('/addresses', AddressController.findAll)
addressRoutes.get('/address/:id', AddressController.findById)
addressRoutes.get('/address/find-by-cep/:cep', AddressController.findByCep)
addressRoutes.get('/address/find-by-key/:key/:search', AddressValidator.findByKey, AddressController.findByKey)
addressRoutes.post('/address/find-by-text', AddressController.findByTextFilter)
addressRoutes.post('/address', restrict, AddressValidator.create, AddressController.create)
addressRoutes.put('/address/:id', restrict, AddressValidator.update, AddressController.update)
addressRoutes.delete('/address/:id', restrict, AddressValidator.delete, AddressController.delete)

export default addressRoutes
