import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { ContentCreated, ContentDeleted, JsonResponse } from '@utils/responses'
import { DistrictEntity, PublicPlaceEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  ContentNotFoundException,
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import PublicPlaceValidator from './validators/public-place.validator'

class PublicPlaceController {
  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    const repository = getRepository(PublicPlaceEntity)

    if (isValid(search)) {
      const data = await repository.find({
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
    const repository = getRepository(PublicPlaceEntity)

    if (district) {
      let publicPlace = new PublicPlaceEntity()
      publicPlace.name = name
      publicPlace.district = district

      try {
        if (await PublicPlaceValidator.create(publicPlace, next)) {
          const result = await repository.save(publicPlace)
          ContentCreated(res, result)
        }
      } catch (e) {
        next(new InternalServerErrorException(e.message))
      }
    } else {
      if (!district) next(new ContentNotFoundException(districtId, 'District'))
    }
  }

  async findAll(req: Request, res: Response) {
    const page = req.query.page || 0

    const repository = getRepository(PublicPlaceEntity)

    const data = await repository.find({
      relations: ['district'],
      skip: Number(page),
      take: 20,
    })

    JsonResponse(res, data)
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(PublicPlaceEntity)
    const item = await repository.findOne(id)

    if (item) {
      JsonResponse(res, item)
    } else {
      next(new ContentNotFoundException(id))
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(PublicPlaceEntity)
    const found = repository.findOne(id)

    if (found) {
      await repository.delete(id)

      ContentDeleted(res)
    } else {
      next(new ContentNotFoundException(id))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item = req.body

    const repository = getRepository(PublicPlaceEntity)
    const found = repository.findOne(id)

    if (found) {
      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } else {
      next(new ContentNotFoundException(id))
    }
  }
}

export default new PublicPlaceController()
