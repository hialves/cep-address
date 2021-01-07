import { ILike } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import { JsonResponse } from '@utils/responses'
import BaseController from './base'
import { AddressEntity } from '@entity/index'
import { isValid } from '@utils/helpers'
import { InvalidFieldValueException } from '@exceptions/index'

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
}

export default new AddressController()

/**
 * const data = await this.repository.find({
        join: { leftJoinAndSelect: {alias} },
        where: { cep: ILike(`%${search}%`) },
        
        
        relations: ['state', 'city', 'district', 'publicPlace'],
      })
 */

/**
  * if (isValid(complement))
      query.where('address.complement ILIKE :complement', {
        complement: `%${complement}%`,
      })
    if (isValid(state)) {
      query.leftJoinAndSelect('address.state', 'state')
      query.andWhere('state.name ILIKE :state', { state: `%${state}%` })
    }
    if (isValid(city)) {
      query.leftJoinAndSelect('address.city', 'city')
      query.andWhere('city.name ILIKE :city', { city: `%${city}%` })
    }
    if (isValid(district)) {
      query.leftJoinAndSelect('address.district', 'district')
      query.andWhere('district.name ILIKE :district', {
        district: `%${district}%`,
      })
    }
  */
