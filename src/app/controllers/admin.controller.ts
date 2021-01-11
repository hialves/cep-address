import { InternalServerErrorException } from '@exceptions/index'
import {
  ContentCreated,
  ContentDeleted,
  ContentNotFound,
  JsonResponse,
} from '@utils/responses'
import { NextFunction, Request, Response } from 'express'
import { AdminEntity } from '@entity/index'
import { getRepository } from 'typeorm'

class AdminController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    const repository = getRepository(AdminEntity)

    try {
      let admin = new AdminEntity()
      admin.name = name
      admin.email = email
      admin.password = password

      const result = await repository.save(admin)

      ContentCreated(res, result)
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }

  async findAll(req: Request, res: Response) {
    const page = req.query.page || 0

    const repository = getRepository(AdminEntity)

    const data = await repository.find({
      skip: Number(page),
      take: 20,
    })

    JsonResponse(res, data)
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(AdminEntity)

    const item = await repository.findOne(id)

    if (item) {
      JsonResponse(res, item)
    } else {
      ContentNotFound(res, 'admin', id)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const repository = getRepository(AdminEntity)

      await repository.delete(id)

      ContentDeleted(res)
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: AdminEntity = req.body

    try {
      const repository = getRepository(AdminEntity)

      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }
}

export default new AdminController()
