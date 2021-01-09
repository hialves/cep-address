import { PublicPlaceController } from '@controllers/index'
import express from 'express'

const publicPlaceRoutes = express.Router()

publicPlaceRoutes.get('/public-places', PublicPlaceController.findAll)
publicPlaceRoutes.get('/public-place/:id', PublicPlaceController.findById)
publicPlaceRoutes.post('/public-place', PublicPlaceController.create)
publicPlaceRoutes.put('/public-place/:id', PublicPlaceController.update)
publicPlaceRoutes.delete('/public-place/:id', PublicPlaceController.delete)

export default publicPlaceRoutes
