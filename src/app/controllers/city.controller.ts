import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { ContentCreated, JsonResponse } from '@utils/responses'
import BaseController from './base'
import { CityEntity, StateEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  ContentNotFoundException,
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import CityValidator from './validators/city.validator'

class CityController extends BaseController<CityEntity> {
  constructor() {
    super(CityEntity)
  }

  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (isValid(search)) {
      const data = await this.repository.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['state', 'districts'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, stateId } = req.body

    const state = await getRepository(StateEntity).findOne(stateId)

    if (state) {
      let city = new CityEntity()
      city.name = name
      city.state = state

      try {
        if (await CityValidator.create(city, next)) {
          const result = await this.repository.save(city)
          ContentCreated(res, result)
        }
      } catch (e) {
        next(new InternalServerErrorException(e.message))
      }
    } else {
      if (!state) next(new ContentNotFoundException(stateId, 'State'))
    }
  }
}

export default new CityController()
