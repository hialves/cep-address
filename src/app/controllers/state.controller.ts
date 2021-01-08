import { ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { JsonResponse } from '@utils/responses'
import BaseController from './base'
import { StateEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import StateValidator from './validators/state.validator'

class StateController extends BaseController<StateEntity> {
  constructor() {
    super(StateEntity)
  }

  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (isValid(search)) {
      const data = await this.repository.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['cities'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, uf } = req.body

    let state = new StateEntity()
    state.name = name
    state.uf = uf

    try {
      if (await StateValidator.create(state, next)) {
        this.repository.save(state)
      }
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new StateController()
