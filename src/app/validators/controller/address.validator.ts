import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { AddressEntity } from '@entity/index'
import { checkIfExists } from '@utils/repository'
import { validate } from 'class-validator'
import {
  ContentNotFound,
  FieldInUse,
  InvalidFieldValue,
  JsonErrorValidation,
} from '@utils/responses'
import { formatCep, isValid } from '@utils/helpers'

export default class AddressValidator {
  static async findByKey(req: Request, res: Response, next: NextFunction) {
    const { key, search } = req.params

    const allowedKeyValues = [
      'complement',
      'state',
      'city',
      'district',
      'publicPlace',
    ]

    if (allowedKeyValues.includes(key) && isValid(search)) {
      next()
    } else {
      if (!allowedKeyValues.includes(key)) InvalidFieldValue(res, 'key')
      if (!isValid(search)) InvalidFieldValue(res, 'search')
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const {
      cep,
      complement,
      stateId,
      cityId,
      districtId,
      publicPlaceId,
    } = req.body

    const repository = getRepository(AddressEntity)

    let address = new AddressEntity()
    address.cep = formatCep(cep)
    address.complement = complement
    address.state = stateId
    address.city = cityId
    address.district = districtId
    address.publicPlace = publicPlaceId

    if (await checkIfExists<AddressEntity>(repository, 'cep', cep)) {
      return FieldInUse(res, 'cep', cep)
    }

    const errors = await validate(address)
    if (errors.length > 0) {
      JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const found = await getRepository(AddressEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'address', id)

    next()
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: AddressEntity = req.body

    const found = await getRepository(AddressEntity).findOne(id)

    if (!found) return ContentNotFound(res, 'address', id)

    const errors = await validate(item)
    if (errors.length > 0) {
      return JsonErrorValidation(res, errors)
    } else {
      next()
    }
  }
}
