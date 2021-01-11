import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { CityEntity, StateEntity } from '@entity/index'
import { ContentNotFound, JsonErrorValidation } from '@utils/responses'
import { validate } from 'class-validator'
import { BaseValidator } from './base'

export default class CityValidator extends BaseValidator {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, stateId } = req.body

    const state = await getRepository(StateEntity).findOne(stateId)

    if (!state) return ContentNotFound(res, 'state', stateId)

    let city = new CityEntity()
    city.name = name
    city.state = stateId

    const errors = await validate(city)
    if (errors.length > 0) {
      JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const found = await getRepository(CityEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'city', id)

    next()
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: CityEntity = req.body

    const found = await getRepository(CityEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'city', id)

    const errors = await validate(item)
    if (errors.length > 0) {
      return JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }
}
