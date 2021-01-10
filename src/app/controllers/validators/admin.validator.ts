import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { AdminEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  CustomException,
  FieldAlreadyInUseException,
  InvalidFieldValueException,
} from '@exceptions/index'
import { checkIfExists } from '@utils/repository'

export default class AdminValidator {
  static async create(admin: AdminEntity, next: NextFunction) {
    const repository = getRepository(AdminEntity)

    if (!isValid(admin.name)) {
      next(new InvalidFieldValueException('name'))
      return false
    } else if (admin.name.length > 100) {
      next(new CustomException(`name length should be less than 100`))
    } else if (!isValid(admin.password)) {
      next(new InvalidFieldValueException('password'))
      return false
    } else if (admin.password.length < 8) {
      next(
        new CustomException(
          `password length should be equal or greater than 8`,
        ),
      )
    } else if (!isValid(admin.email)) {
      next(new InvalidFieldValueException('email'))
      return false
    } else if (admin.email.length > 100) {
      next(new CustomException(`email length should be less than 100`))
    } else if (
      await checkIfExists<AdminEntity>(repository, 'email', admin.email)
    ) {
      next(new FieldAlreadyInUseException('email', admin.email))
      return false
    }

    return true
  }
}
