import { FindManyOptions, getRepository, ILike, JoinOptions } from 'typeorm'
import { NextFunction, Request, Response } from 'express'

import {
  ContentCreated,
  ContentDeleted,
  ContentNotFound,
  JsonResponse,
} from '@utils/responses'
import { AddressEntity } from '@entity/index'
import { formatCep, isValid } from '@utils/helpers'
import { InternalServerErrorException } from '@exceptions/index'

class AddressController {
  // Similar a findByTextFilter, mas consome menos recurso para realizar a busca
  async findByKey(req: Request, res: Response, next: NextFunction) {
    const { key, search } = req.params
    const page = req.query.page || 0

    const repository = getRepository(AddressEntity)

    const fields = [
      { key: 'complement', fk: false },
      { key: 'state', fk: true },
      { key: 'city', fk: true },
      { key: 'district', fk: true },
      { key: 'publicPlace', fk: true },
    ]

    const field = fields.find((field) => field.key === key)

    if (field) {
      let findOptions: FindManyOptions = {
        where: { [field.key]: ILike(`%${search}%`) },
        relations: ['state', 'city', 'district', 'publicPlace'],
        skip: Number(page),
        take: 20,
      }

      if (field.fk) {
        const join: JoinOptions = {
          alias: key,
          leftJoinAndSelect: { [key]: `address.${key}` },
        }

        findOptions.join = join
      }

      const data = await repository.find(findOptions)

      JsonResponse(res, data)
    }
  }

  async findByTextFilter(req: Request, res: Response, next: NextFunction) {
    const { complement, state, city, district, publicPlace } = req.body
    const page = req.query.page || 0

    const repository = getRepository(AddressEntity)

    const fields = [
      { key: 'complement', value: complement, fk: false },
      { key: 'state', value: state, fk: true },
      { key: 'city', value: city, fk: true },
      { key: 'district', value: district, fk: true },
      { key: 'publicPlace', value: publicPlace, fk: true },
    ]

    const query = repository.createQueryBuilder().select()
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

    const repository = getRepository(AddressEntity)

    const data = await repository.find({
      where: { cep },
      relations: ['state', 'city', 'district', 'publicPlace'],
    })

    JsonResponse(res, data)
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

    try {
      const repository = getRepository(AddressEntity)

      let address = new AddressEntity()
      address.cep = formatCep(cep)
      address.complement = complement
      address.state = stateId
      address.city = cityId
      address.district = districtId
      address.publicPlace = publicPlaceId

      const result = await repository.save(address)
      ContentCreated(res, result)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    const page = req.query.page || 0

    const repository = getRepository(AddressEntity)

    const data = await repository.find({
      relations: ['state', 'city', 'district', 'publicPlace'],
      skip: Number(page),
      take: 20,
    })

    JsonResponse(res, data)
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    const repository = getRepository(AddressEntity)

    const item = await repository.findOne(id)

    if (item) {
      JsonResponse(res, item)
    } else {
      ContentNotFound(res, 'address', id)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const repository = getRepository(AddressEntity)

      await repository.delete(id)

      ContentDeleted(res)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const item: AddressEntity = req.body

    try {
      const repository = getRepository(AddressEntity)

      const data = await repository.update(id, item)

      JsonResponse(res, data)
    } catch (e) {
      next(new InternalServerErrorException(e.message))
    }
  }
}

export default new AddressController()
