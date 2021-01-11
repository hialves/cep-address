import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { StateEntity } from '@entity/index'
import { BaseValidator } from './base'
import { validate } from 'class-validator'
import { ContentNotFound, JsonErrorValidation } from '@utils/responses'

export default class StateValidator extends BaseValidator {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, uf } = req.body

    let state = new StateEntity()
    state.name = name
    state.uf = uf

    const errors = await validate(state)
    if (errors.length > 0) {
      JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const found = await getRepository(StateEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'state', id)

    next()
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: StateEntity = req.body

    const found = await getRepository(StateEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'state', id)

    const errors = await validate(item)
    if (errors.length > 0) {
      return JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }
}
