import { getRepository, ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { ContentCreated, JsonResponse } from '@utils/responses'
import BaseController from './base'
import {
  AddressEntity,
  CityEntity,
  DistrictEntity,
  PublicPlaceEntity,
  StateEntity,
} from '@entity/index'
import { isValid } from '@utils/helpers'
import {
  ContentNotFoundException,
  InternalServerErrorException,
  InvalidFieldValueException,
} from '@exceptions/index'
import AddressValidator from './validators/address.validator'

class AddressController extends BaseController<AddressEntity> {
  constructor() {
    super(AddressEntity)
  }

  async findByKey(req: Request, res: Response, next: NextFunction) {
    const { key, search } = req.body
    const page = req.query.page || 0

    const allowedKeyValues = [
      'cep',
      'complement',
      'state',
      'city',
      'district',
      'publicPlace',
    ]

    //prettier-ignore
    if (isValid(key) && isValid(search) && allowedKeyValues.includes(key) ) {
      const data = await this.repository.find({
        where: { [key]: search },
        skip: Number(page),
        take: 20,
      })

      JsonResponse(res, data)
    }else {
      if(!isValid(key) || !allowedKeyValues.includes(key)) next(new InvalidFieldValueException('key'))
      else if(!isValid(search)) next(new InvalidFieldValueException('search'))
    }
  }

  async findByTextFilter(req: Request, res: Response) {
    const { complement, state, city, district } = req.body

    const fields = [
      { key: 'complement', value: complement },
      { key: 'state', value: state },
      { key: 'city', value: city },
      { key: 'district', value: district },
    ]

    const query = this.repository.createQueryBuilder().select()
    let queryHasWhere = false

    fields.map((field) => {
      if (isValid(field)) {
        queryHasWhere = true
        const whereSql = `address.${field.key} ILIKE :value`
        const obj = { value: `%${field.value}%` }

        // Verifica a necessidade de adicionar um AND no WHERE
        queryHasWhere
          ? query.andWhere(whereSql, obj)
          : query.where(whereSql, obj)
      }
    })

    if (queryHasWhere) {
      const data = await query.getMany()

      JsonResponse(res, data)
    } else {
      JsonResponse(res, [])
    }
  }

  async findByCep(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (isValid(search)) {
      const data = await this.repository.find({
        where: { cep: ILike(`%${search}%`) },
        relations: ['state', 'city', 'district', 'publicPlace'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('search'))
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const {
      cep,
      complement,
      stateId,
      cityId,
      districtId,
      publicPlaceId,
    } = req.body

    const state = await getRepository(StateEntity).findOne(stateId)
    const city = await getRepository(CityEntity).findOne(cityId)
    const district = await getRepository(DistrictEntity).findOne(districtId)
    //prettier-ignore
    const publicPlace = await getRepository(PublicPlaceEntity).findOne(publicPlaceId)

    if (state && city && district && publicPlace) {
      let address = new AddressEntity()
      address.cep = cep
      address.complement = complement
      address.state = state
      address.city = city
      address.district = district
      address.publicPlace = publicPlace

      try {
        if (await AddressValidator.create(address, next)) {
          const result = await this.repository.save(city)
          ContentCreated(res, result)
        }
      } catch (e) {
        next(new InternalServerErrorException(e.message))
      }
    } else {
      if (!state) next(new InvalidFieldValueException('stateId'))
      else if (!cityId) next(new InvalidFieldValueException('cityId'))
      else if (!districtId) next(new InvalidFieldValueException('districtId'))
      else if (!publicPlaceId)
        next(new InvalidFieldValueException('publicPlaceId'))
    }
  }
}

export default new AddressController()
