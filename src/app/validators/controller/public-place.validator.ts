import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { DistrictEntity, PublicPlaceEntity } from '@entity/index'
import { BaseValidator } from './base'
import { ContentNotFound, JsonErrorValidation } from '@utils/responses'
import { validate } from 'class-validator'

export default class PublicPlaceValidator extends BaseValidator {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, districtId } = req.body

    const district = await getRepository(DistrictEntity).findOne(districtId)

    if (!district) return ContentNotFound(res, 'district', districtId)

    let publicPlace = new PublicPlaceEntity()
    publicPlace.name = name
    publicPlace.district = districtId

    const errors = await validate(publicPlace)
    if (errors.length > 0) {
      JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const found = await getRepository(PublicPlaceEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'publicPlace', id)

    next()
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: PublicPlaceEntity = req.body

    const found = await getRepository(PublicPlaceEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'publicPlace', id)

    const errors = await validate(item)
    if (errors.length > 0) {
      return JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }
}
