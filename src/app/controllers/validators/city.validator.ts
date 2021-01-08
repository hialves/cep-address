import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { CityEntity } from '@entity/index'

export default class CityValidator {
  static async create(city: CityEntity, next: NextFunction) {
    const repository = getRepository(CityEntity)

    // TODO

    return true
  }
}
