import { ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { JsonResponse } from '@utils/responses'
import BaseController from './base'
import { DistrictEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import { InvalidFieldValueException } from '@exceptions/index'

class DistrictController extends BaseController<DistrictEntity> {
  constructor() {
    super(DistrictEntity)
  }

  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (isValid(search)) {
      const data = await this.repository.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['city', 'publicPlace'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }
}

export default new DistrictController()
