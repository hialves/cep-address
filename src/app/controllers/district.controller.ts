import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { ContentCreated, ContentDeleted, JsonResponse } from '@utils/responses'
import { CityEntity, DistrictEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  ContentNotFoundException,
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import DistrictValidator from './validators/district.validator'

class DistrictController {
  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    const repository = getRepository(DistrictEntity)

    if (isValid(search)) {
      const data = await repository.find({
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
    const repository = getRepository(DistrictEntity)

    if (city) {
      let district = new DistrictEntity()
      district.name = name
      district.city = city

      try {
        if (await DistrictValidator.create(district, next)) {
          const result = await repository.save(district)
          ContentCreated(res, result)
        }
      } catch (e) {
        next(new InternalServerErrorException(e.message))
      }
    } else {
      if (!city) next(new ContentNotFoundException(cityId, 'City'))
    }
  }

  async findAll(req: Request, res: Response) {
    const page = req.query.page || 0

    const repository = getRepository(DistrictEntity)

    const data = await repository.find({
      relations: ['city', 'publicPlaces'],
      skip: Number(page),
      take: 20,
    })

    JsonResponse(res, data)
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(DistrictEntity)

    const item = await repository.findOne(id)

    if (item) {
      JsonResponse(res, item)
    } else {
      next(new ContentNotFoundException(id))
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(DistrictEntity)

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

    const repository = getRepository(DistrictEntity)

    const found = repository.findOne(id)

    if (found) {
      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } else {
      next(new ContentNotFoundException(id))
    }
  }
}

export default new DistrictController()
