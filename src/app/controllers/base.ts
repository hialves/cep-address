import { NextFunction, Request, Response } from 'express'
import { EntityTarget, getRepository, Repository } from 'typeorm'

import { JsonResponse, ContentDeleted } from '@utils/responses'
import { ContentNotFoundException } from '@exceptions/index'
import { RouteNotImplementedException } from '@exceptions/server.exception'

export interface IBaseController {
  findAll: (req: Request, res: Response) => Promise<void>
  findById: (req: Request, res: Response, next: NextFunction) => Promise<void>
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>
  delete: (req: Request, res: Response, next: NextFunction) => Promise<void>
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export default abstract class BaseController<T> implements IBaseController {
  public repository: Repository<T>

  constructor(entity: EntityTarget<T>) {
    this.repository = getRepository(entity)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    next(new RouteNotImplementedException(req.path))
  }

  async findAll(req: Request, res: Response) {
    const page = req.query.page || 0

    const data = await this.repository.find({
      skip: Number(page),
      take: 20,
    })

    JsonResponse(res, data)
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const item = await this.repository.findOne(id)

    if (item) {
      JsonResponse(res, item)
    } else {
      next(new ContentNotFoundException(id))
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const found = this.repository.findOne(id)

    if (found) {
      await this.repository.delete(id)

      ContentDeleted(res)
    } else {
      next(new ContentNotFoundException(id))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item = req.body

    const found = this.repository.findOne(id)

    if (found) {
      const data = await this.repository.update(id, item)

      JsonResponse(res, data)
    } else {
      next(new ContentNotFoundException(id))
    }
  }
}
