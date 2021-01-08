import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { StateEntity } from '@entity/index'
import {
  CustomException,
  InvalidFieldValueException,
  FieldAlreadyInUseException,
} from '@exceptions/index'
import { isValid } from '@utils/helpers'
import { checkIfExists } from '@utils/repository'

export default class StateValidator {
  static async create(state: StateEntity, next: NextFunction) {
    const repository = getRepository(StateEntity)

    if (!isValid(state.name)) {
      next(new InvalidFieldValueException('name'))
      return false
    } else if (!isValid(state.uf)) {
      next(new InvalidFieldValueException('uf'))
      return false
    } else if (state.name.length > 50) {
      next(new CustomException(`name length should be less than 50`))
    } else if (state.uf.length != 2) {
      next(new CustomException(`uf length should be equal to 2`))
    } else if (
      await checkIfExists<StateEntity>(repository, 'name', state.name)
    ) {
      next(new FieldAlreadyInUseException('name', state.name))
      return false
    } else if (await checkIfExists<StateEntity>(repository, 'uf', state.uf)) {
      next(new FieldAlreadyInUseException('uf', state.uf))
      return false
    }

    return true
  }
}
