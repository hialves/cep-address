import { InternalServerErrorException } from '@exceptions/index'
import { ContentCreated } from '@utils/responses'
import { NextFunction, Request, Response } from 'express'
import { AdminEntity } from '@entity/index'
import AdminValidator from './validators/admin.validator'
import BaseController from './base'

class AdminController extends BaseController<AdminEntity> {
  constructor() {
    super(AdminEntity)
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    try {
      let admin = new AdminEntity()
      admin.name = name
      admin.email = email
      admin.password = password

      if (await AdminValidator.create(admin, next)) {
        const result = await this.repository.save(admin)

        ContentCreated(res, result)
      }
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }
}

export default new AdminController()
