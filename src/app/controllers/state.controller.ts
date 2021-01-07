import { ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { JsonResponse } from '@utils/responses'
import BaseController from './base'
import { StateEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import { InvalidFieldValueException } from '@exceptions/index'

class StateController extends BaseController<StateEntity> {
  constructor() {
    super(StateEntity)
  }

  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (isValid(search)) {
      const data = await this.repository.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['city'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }
}

export default new StateController()
