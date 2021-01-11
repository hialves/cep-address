import { CityController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import CityValidator from 'app/validators/controller/city.validator'
import express from 'express'

const cityRoutes = express.Router()

cityRoutes.get('/cities', CityController.findAll)
cityRoutes.get('/city/:id', CityController.findById)
cityRoutes.get('/cities/search/:search', CityValidator.find, CityController.find)
cityRoutes.post('/city', restrict, CityValidator.create, CityController.create)
cityRoutes.put('/city/:id', restrict, CityValidator.update, CityController.update)
cityRoutes.delete('/city/:id', restrict, CityValidator.delete, CityController.delete)

export default cityRoutes
