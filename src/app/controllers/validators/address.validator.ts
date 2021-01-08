import { NextFunction } from 'express'
import { getRepository } from 'typeorm'

import { AddressEntity } from '@entity/index'

export default class AddressValidator {
  static async create(address: AddressEntity, next: NextFunction) {
    const repository = getRepository(AddressEntity)

    // TODO

    return true
  }
}
