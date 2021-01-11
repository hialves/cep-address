import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import {
  ContentCreated,
  ContentDeleted,
  ContentNotFound,
  JsonResponse,
} from '@utils/responses'
import { StateEntity } from '@entity/index'
import { InternalServerErrorException } from '@exceptions/index'

class StateController {
  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    const repository = getRepository(StateEntity)

    const data = await repository.find({
      where: { name: ILike(`%${search}%`) },
      relations: ['cities'],
    })

    JsonResponse(res, data)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, uf } = req.body

    try {
      const repository = getRepository(StateEntity)

      let state = new StateEntity()
      state.name = name
      state.uf = uf

      const result = await repository.save(state)
      ContentCreated(res, result)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async findAll(req: Request, res: Response) {
    const page = req.query.page || 0

    const repository = getRepository(StateEntity)

    const data = await repository.find({
      relations: ['cities'],
      skip: Number(page),
      take: 20,
    })

    JsonResponse(res, data)
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(StateEntity)
    const item = await repository.findOne(id)

    if (item) {
      JsonResponse(res, item)
    } else {
      ContentNotFound(res, 'state', id)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(StateEntity)
    try {
      await repository.delete(id)

      ContentDeleted(res)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: StateEntity = req.body

    try {
      const repository = getRepository(StateEntity)

      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new StateController()
