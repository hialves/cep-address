import { PublicPlaceController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import express from 'express'

const publicPlaceRoutes = express.Router()

publicPlaceRoutes.get('/public-places', PublicPlaceController.findAll)
publicPlaceRoutes.get('/public-place/:id', PublicPlaceController.findById)
publicPlaceRoutes.post('/public-place', restrict, PublicPlaceController.create)
publicPlaceRoutes.put('/public-place/:id', PublicPlaceController.update)
publicPlaceRoutes.delete('/public-place/:id', PublicPlaceController.delete)

export default publicPlaceRoutes
