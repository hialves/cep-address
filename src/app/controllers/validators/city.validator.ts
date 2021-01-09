import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { CityEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  CustomException,
  FieldAlreadyInUseException,
  InvalidFieldValueException,
} from '@exceptions/index'
import { checkIfExists } from '@utils/repository'

export default class CityValidator {
  static async create(city: CityEntity, next: NextFunction) {
    const repository = getRepository(CityEntity)

    if (!isValid(city.name)) {
      next(new InvalidFieldValueException('name'))
      return false
    } else if (city.name.length > 50) {
      next(new CustomException(`name length should be less than 50`))
    } else if (await checkIfExists<CityEntity>(repository, 'name', city.name)) {
      next(new FieldAlreadyInUseException('name', city.name))
      return false
    }

    return true
  }
}
