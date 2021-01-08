import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { DistrictEntity } from '@entity/index'

export default class DistrictValidator {
  static async create(district: DistrictEntity, next: NextFunction) {
    const repository = getRepository(DistrictEntity)

    // TODO

    return true
  }
}
