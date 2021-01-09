import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { ContentCreated, JsonResponse } from '@utils/responses'
import BaseController from './base'
import { DistrictEntity, PublicPlaceEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  ContentNotFoundException,
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import PublicPlaceValidator from './validators/public-place.validator'

class PublicPlaceController extends BaseController<PublicPlaceEntity> {
  constructor() {
    super(PublicPlaceEntity)
  }

  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (isValid(search)) {
      const data = await this.repository.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['district'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, districtId } = req.body

    const district = await getRepository(DistrictEntity).findOne(districtId)

    if (district) {
      let publicPlace = new PublicPlaceEntity()
      publicPlace.name = name
      publicPlace.district = district

      try {
        if (await PublicPlaceValidator.create(publicPlace, next)) {
          const result = await this.repository.save(publicPlace)
          ContentCreated(res, result)
        }
      } catch (e) {
        next(new InternalServerErrorException(e.message))
      }
    } else {
      if (!district) next(new ContentNotFoundException(districtId, 'District'))
    }
  }
}

export default new PublicPlaceController()
