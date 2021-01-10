import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { ContentCreated, ContentDeleted, JsonResponse } from '@utils/responses'
import { StateEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  ContentNotFoundException,
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import StateValidator from './validators/state.validator'

class StateController {
  async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    const repository = getRepository(StateEntity)

    if (isValid(search)) {
      const data = await repository.find({
        where: { name: ILike(`%${search}%`) },
        relations: ['cities'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, uf } = req.body

    const repository = getRepository(StateEntity)

    let state = new StateEntity()
    state.name = name
    state.uf = uf

    try {
      if (await StateValidator.create(state, next)) {
        const result = await repository.save(state)
        ContentCreated(res, result)
      }
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
      next(new ContentNotFoundException(id))
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(StateEntity)
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

    const repository = getRepository(StateEntity)
    const found = repository.findOne(id)

    if (found) {
      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } else {
      next(new ContentNotFoundException(id))
    }
  }
}

export default new StateController()
