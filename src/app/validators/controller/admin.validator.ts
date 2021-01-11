import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { AdminEntity } from '@entity/index'
import {
  ContentNotFound,
  FieldInUse,
  JsonErrorValidation,
} from '@utils/responses'
import { validate } from 'class-validator'

export default class AdminValidator {
  static async create(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body

    const checkEmail = await getRepository(AdminEntity).findOne({
      where: { email },
    })

    if (checkEmail) return FieldInUse(res, 'email', email)

    let admin = new AdminEntity()
    admin.name = name
    admin.email = email
    admin.password = password

    const errors = await validate(admin)
    if (errors.length > 0) {
      JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const found = await getRepository(AdminEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'city', id)

    next()
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: AdminEntity = req.body

    const found = await getRepository(AdminEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'city', id)

    const errors = await validate(item)
    if (errors.length > 0) {
      return JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }
}
