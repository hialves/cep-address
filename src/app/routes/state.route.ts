import { StateController } from '@controllers/index'
import express from 'express'

const stateRoutes = express.Router()

stateRoutes.get('/states', StateController.findAll)
stateRoutes.get('/state/:id', StateController.findById)
stateRoutes.post('/state', StateController.create)
stateRoutes.put('/state/:id', StateController.update)
stateRoutes.delete('/state/:id', StateController.delete)

export default stateRoutes
