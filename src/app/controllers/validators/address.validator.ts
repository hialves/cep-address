import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { AddressEntity } from '@entity/index'
import { isCep, isValid } from '@utils/helpers'
import {
  InvalidFieldValueException,
  FieldAlreadyInUseException,
} from '@exceptions/index'
import { checkIfExists } from '@utils/repository'

export default class AddressValidator {
  static async create(address: AddressEntity, next: NextFunction) {
    const repository = getRepository(AddressEntity)

    if (!isValid(address.cep) || isCep(address.cep)) {
      next(new InvalidFieldValueException('cep'))
      return false
    } else if (
      await checkIfExists<AddressEntity>(repository, 'cep', address.cep)
    ) {
      next(new FieldAlreadyInUseException('cep', address.cep))
      return false
    }

    return true
  }
}
