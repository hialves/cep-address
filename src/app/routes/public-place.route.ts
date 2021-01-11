import { PublicPlaceController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import PublicPlaceValidator from 'app/validators/controller/public-place.validator'
import express from 'express'

const publicPlaceRoutes = express.Router()

publicPlaceRoutes.get('/public-places', PublicPlaceController.findAll)
publicPlaceRoutes.get('/public-place/:id', PublicPlaceController.findById)
publicPlaceRoutes.get('/public-places/search/:search', PublicPlaceValidator.find, PublicPlaceController.find)
publicPlaceRoutes.post('/public-place', restrict, PublicPlaceController.create)
publicPlaceRoutes.put('/public-place/:id', restrict, PublicPlaceController.update)
publicPlaceRoutes.delete('/public-place/:id', restrict, PublicPlaceController.delete)

export default publicPlaceRoutes
