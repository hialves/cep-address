import { DistrictController } from '@controllers/index'
import express from 'express'

const districtRoutes = express.Router()

districtRoutes.get('/districts', DistrictController.findAll)
districtRoutes.get('/district/:id', DistrictController.findById)
districtRoutes.post('/district', DistrictController.create)
districtRoutes.put('/district/:id', DistrictController.update)
districtRoutes.delete('/district/:id', DistrictController.delete)

export default districtRoutes
