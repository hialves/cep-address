import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { ContentCreated, JsonResponse } from '@utils/responses'
import BaseController from './base'
import { CityEntity, DistrictEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import DistrictValidator from './validators/district.validator'

class DistrictController extends BaseController<DistrictEntity> {
  constructor() {
    super(DistrictEntity)
  }

  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (isValid(search)) {
      const data = await this.repository.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['city', 'publicPlaces'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, cityId } = req.body

    const city = await getRepository(CityEntity).findOne(cityId)

    if (city) {
      let district = new DistrictEntity()
      district.name = name
      district.city = city

      try {
        if (await DistrictValidator.create(district, next)) {
          const result = await this.repository.save(district)
          ContentCreated(res, result)
        }
      } catch (e) {
        next(new InternalServerErrorException(e.message))
      }
    } else {
      // TODO
    }
  }
}

export default new DistrictController()
