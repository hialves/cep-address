import { StateController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import StateValidator from 'app/validators/controller/state.validator'
import express from 'express'

const stateRoutes = express.Router()

stateRoutes.get('/states', StateController.findAll)
stateRoutes.get('/state/:id', StateController.findById)
stateRoutes.get('/states/search/:search', StateValidator.find, StateController.find)
stateRoutes.post('/state', restrict, StateValidator.create, StateController.create)
stateRoutes.put('/state/:id', restrict, StateValidator.update, StateController.update)
stateRoutes.delete('/state/:id', restrict, StateValidator.delete, StateController.delete)

export default stateRoutes
