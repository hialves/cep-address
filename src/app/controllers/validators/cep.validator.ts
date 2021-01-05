import { NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'

import { UserRepository } from '@repository/index'
import { IUser } from '@entity/user.entity'
import { InvalidFieldValueException } from '@exceptions/server.exception'
import { UserFieldAlreadyInUseException } from '@exceptions/user.exception'
import { isValid } from '@utils/helpers'

export default class UserValidator {
  static async create(user: IUser, next: NextFunction) {
    const userRepository = getCustomRepository(UserRepository)

    if (await userRepository.checkIfExists('nickname', user.nickname)) {
      next(new UserFieldAlreadyInUseException('nickname'))
      return false
    } else if (await userRepository.checkIfExists('email', user.email)) {
      next(new UserFieldAlreadyInUseException('email'))
      return false
    } else if (!isValid(user.nickname)) {
      next(new InvalidFieldValueException('nickname'))
      return false
    } else if (!isValid(user.email)) {
      next(new InvalidFieldValueException('email'))
      return false
    } else if (!isValid(user.password)) {
      next(new InvalidFieldValueException('password'))
      return false
    }

    return true
  }
}
