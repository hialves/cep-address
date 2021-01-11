import { DistrictController } from '@controllers/index'
import { restrict } from '@middlewares/jwt'
import DistrictValidator from 'app/validators/controller/district.validator'
import express from 'express'

const districtRoutes = express.Router()

districtRoutes.get('/districts', DistrictController.findAll)
districtRoutes.get('/district/:id', DistrictController.findById)
districtRoutes.get('/districts/search/:search', DistrictValidator.find, DistrictController.find)
districtRoutes.post('/district', restrict, DistrictValidator.create, DistrictController.create)
districtRoutes.put('/district/:id', restrict, DistrictValidator.update, DistrictController.update)
districtRoutes.delete('/district/:id', restrict, DistrictValidator.update, DistrictController.delete)

export default districtRoutes
