import { FindManyOptions, getRepository, ILike, JoinOptions } from 'typeorm'
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
import { formatCep, isValid } from '@utils/helpers'
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

  // Similar a findByTextFilter, mas consome menos recurso para realizar a busca
  async findByKey(req: Request, res: Response, next: NextFunction) {
    const { key, search } = req.params
    const page = req.query.page || 0

    const allowedKeyValues = [
      'complement',
      'state',
      'city',
      'district',
      'publicPlace',
    ]

    const fields = [
      { key: 'complement', fk: false },
      { key: 'state', fk: true },
      { key: 'city', fk: true },
      { key: 'district', fk: true },
      { key: 'publicPlace', fk: true },
    ]

    const field = fields.find((field) => field.key === key)

    //prettier-ignore
    if (isValid(key) && isValid(search) && allowedKeyValues.includes(key) && field) {
      let findOptions: FindManyOptions = {
        where: { [field.key]: ILike(`%${search}%`) },
        relations: ['state', 'city', 'district', 'publicPlace'],
        skip: Number(page),
        take: 20,
      }

      if(field.fk) {
        const join: JoinOptions = {
          alias: key,
          leftJoinAndSelect: { [key]: `address.${key}`}
        }

        findOptions.join = join
      }

      const data = await this.repository.find(findOptions)

      JsonResponse(res, data)
    }else {
      if(!isValid(key) || !allowedKeyValues.includes(key)) next(new InvalidFieldValueException('key'))
      else if(!isValid(search)) next(new InvalidFieldValueException('search'))
    }
  }

  async findByTextFilter(req: Request, res: Response) {
    const { complement, state, city, district, publicPlace } = req.body
    const page = req.query.page || 0

    const fields = [
      { key: 'complement', value: complement, fk: false },
      { key: 'state', value: state, fk: true },
      { key: 'city', value: city, fk: true },
      { key: 'district', value: district, fk: true },
      { key: 'publicPlace', value: publicPlace, fk: true },
    ]

    const query = this.repository.createQueryBuilder().select()
    let queryHasWhere = false

    fields.map((field) => {
      if (isValid(field)) {
        let whereSql = `address.${field.key} ILIKE :value`
        const obj = { value: `%${field.value}%` }

        if (field.fk) {
          query.leftJoinAndSelect(`address.${field.key}`, field.key)
          whereSql = `${field.key}.name ILIKE :value`
        }

        // Verifica a necessidade de adicionar um AND no WHERE
        queryHasWhere
          ? query.andWhere(whereSql, obj)
          : query.where(whereSql, obj)

        queryHasWhere = true
      }
    })

    if (queryHasWhere) {
      const data = await query.skip(Number(page)).take(20).getMany()

      JsonResponse(res, data)
    } else {
      JsonResponse(res, [])
    }
  }

  async findByCep(req: Request, res: Response, next: NextFunction) {
    const { cep } = req.params

    if (isValid(cep)) {
      const data = await this.repository.find({
        where: { cep },
        relations: ['state', 'city', 'district', 'publicPlace'],
      })

      JsonResponse(res, data)
    } else {
      next(new InvalidFieldValueException('cep'))
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
      address.cep = formatCep(cep)
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
      if (!state) next(new ContentNotFoundException(stateId, 'State'))
      else if (!cityId) next(new ContentNotFoundException(cityId, 'City'))
      else if (!districtId)
        next(new ContentNotFoundException(districtId, 'District'))
      else if (!publicPlaceId)
        next(new ContentNotFoundException(publicPlaceId, 'Public place'))
    }
  }
}

export default new AddressController()
