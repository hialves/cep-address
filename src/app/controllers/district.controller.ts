import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import {
  ContentCreated,
  ContentDeleted,
  ContentNotFound,
  JsonResponse,
} from '@utils/responses'
import { DistrictEntity } from '@entity/index'
import { InternalServerErrorException } from '@exceptions/index'

class DistrictController {
  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    const repository = getRepository(DistrictEntity)

    const data = await repository.find({
      where: { name: ILike(`%${search}%`) },
      relations: ['city', 'publicPlaces'],
    })

    JsonResponse(res, data)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, cityId } = req.body

    try {
      const repository = getRepository(DistrictEntity)

      let district = new DistrictEntity()
      district.name = name
      district.city = cityId

      const result = await repository.save(district)
      ContentCreated(res, result)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
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
      ContentNotFound(res, 'district', id)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const repository = getRepository(DistrictEntity)

      await repository.delete(id)

      ContentDeleted(res)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: DistrictEntity = req.body

    try {
      const repository = getRepository(DistrictEntity)

      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new DistrictController()
