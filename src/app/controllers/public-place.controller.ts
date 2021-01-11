import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import {
  ContentCreated,
  ContentDeleted,
  ContentNotFound,
  JsonResponse,
} from '@utils/responses'
import { PublicPlaceEntity } from '@entity/index'
import { InternalServerErrorException } from '@exceptions/index'

class PublicPlaceController {
  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    const repository = getRepository(PublicPlaceEntity)

    const data = await repository.find({
      where: { name: ILike(`%${search}%`) },
      relations: ['district'],
    })

    JsonResponse(res, data)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, districtId } = req.body

    try {
      const repository = getRepository(PublicPlaceEntity)

      let publicPlace = new PublicPlaceEntity()
      publicPlace.name = name
      publicPlace.district = districtId

      const result = await repository.save(publicPlace)
      ContentCreated(res, result)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
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
      ContentNotFound(res, 'publicPlace', id)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const repository = getRepository(PublicPlaceEntity)

      await repository.delete(id)

      ContentDeleted(res)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: PublicPlaceEntity = req.body

    try {
      const repository = getRepository(PublicPlaceEntity)

      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new PublicPlaceController()
