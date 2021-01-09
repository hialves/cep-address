import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { PublicPlaceEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  CustomException,
  FieldAlreadyInUseException,
  InvalidFieldValueException,
} from '@exceptions/index'
import { checkIfExists } from '@utils/repository'

export default class PublicPlaceValidator {
  static async create(publicPlace: PublicPlaceEntity, next: NextFunction) {
    const repository = getRepository(PublicPlaceEntity)

    if (!isValid(publicPlace.name)) {
      next(new InvalidFieldValueException('name'))
      return false
    } else if (publicPlace.name.length > 50) {
      next(new CustomException(`name length should be less than 50`))
    } else if (
      //prettier-ignore
      await checkIfExists<PublicPlaceEntity>(repository, 'name', publicPlace.name)
    ) {
      next(new FieldAlreadyInUseException('name', publicPlace.name))
      return false
    }

    return true
  }
}
