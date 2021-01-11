import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { CityEntity, DistrictEntity } from '@entity/index'
import { ContentNotFound, JsonErrorValidation } from '@utils/responses'
import { validate } from 'class-validator'
import { BaseValidator } from './base'

export default class DistrictValidator extends BaseValidator {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, cityId } = req.body

    const city = await getRepository(CityEntity).findOne(cityId)

    if (!city) return ContentNotFound(res, 'city', cityId)

    let district = new DistrictEntity()
    district.name = name
    district.city = cityId

    const errors = await validate(district)
    if (errors.length > 0) {
      JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const found = await getRepository(DistrictEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'city', id)

    next()
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: DistrictEntity = req.body

    const found = await getRepository(DistrictEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'city', id)

    const errors = await validate(item)
    if (errors.length > 0) {
      return JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }
}
