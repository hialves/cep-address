import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { DistrictEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  InvalidFieldValueException,
  CustomException,
  FieldAlreadyInUseException,
} from '@exceptions/index'
import { checkIfExists } from '@utils/repository'

export default class DistrictValidator {
  static async create(district: DistrictEntity, next: NextFunction) {
    const repository = getRepository(DistrictEntity)

    if (!isValid(district.name)) {
      next(new InvalidFieldValueException('name'))
      return false
    } else if (district.name.length > 50) {
      next(new CustomException(`name length should be less than 50`))
    } else if (
      await checkIfExists<DistrictEntity>(repository, 'name', district.name)
    ) {
      next(new FieldAlreadyInUseException('name', district.name))
      return false
    }

    return true
  }
}
