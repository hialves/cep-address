import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import {
  ContentCreated,
  ContentDeleted,
  ContentNotFound,
  JsonResponse,
} from '@utils/responses'
import { CityEntity } from '@entity/index'
import { InternalServerErrorException } from '@exceptions/index'

class CityController {
  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    const repository = getRepository(CityEntity)

    const data = await repository.find({
      where: { name: ILike(`%${search}%`) },
      relations: ['state', 'districts'],
    })

    JsonResponse(res, data)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, stateId } = req.body

    try {
      const repository = getRepository(CityEntity)

      let city = new CityEntity()
      city.name = name
      city.state = stateId

      const result = await repository.save(city)
      ContentCreated(res, result)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async findAll(req: Request, res: Response) {
    const page = req.query.page || 0

    const repository = getRepository(CityEntity)

    const data = await repository.find({
      relations: ['state', 'districts'],
      skip: Number(page),
      take: 20,
    })

    JsonResponse(res, data)
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(CityEntity)

    const item = await repository.findOne(id)

    if (item) {
      JsonResponse(res, item)
    } else {
      ContentNotFound(res, 'city', id)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const repository = getRepository(CityEntity)

      await repository.delete(id)

      ContentDeleted(res)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: CityEntity = req.body

    try {
      const repository = getRepository(CityEntity)

      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new CityController()
