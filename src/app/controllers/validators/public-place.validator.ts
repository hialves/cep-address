import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { PublicPlaceEntity } from '@entity/index'

export default class PublicPlaceValidator {
  static async create(publicPlace: PublicPlaceEntity, next: NextFunction) {
    const repository = getRepository(PublicPlaceEntity)

    // TODO

    return true
  }
}
