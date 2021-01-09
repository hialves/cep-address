import { CityController } from '@controllers/index'
import express from 'express'

const cityRoutes = express.Router()

cityRoutes.get('/cities', CityController.findAll)
cityRoutes.get('/city/:id', CityController.findById)
cityRoutes.post('/city', CityController.create)
cityRoutes.put('/city/:id', CityController.update)
cityRoutes.delete('/city/:id', CityController.delete)

export default cityRoutes
