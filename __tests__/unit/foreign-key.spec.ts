import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import {
  AddressEntity,
  CityEntity,
  DistrictEntity,
  PublicPlaceEntity,
  StateEntity,
} from '@entity/index'
import { createConnection, getConnection, getRepository } from 'typeorm'
import { revertMigrations, truncate } from '../utils/database'
import * as data from '../data.json'
import {
  createAddress,
  createCity,
  createDistrict,
  createPublicPlace,
  createState,
} from '../utils/entity'

describe('Test', () => {
  beforeAll(async () => {
    await createConnection()

    await getConnection().runMigrations()
  })

  beforeEach(async () => {
    await truncate()
  })

  afterAll(async () => {
    await revertMigrations()

    await getConnection().close()
  })

  it('validate if CityEntity foreign keys has been set', async () => {
    const createdState = await createState()
    const createdCity = await createCity(createdState.id)

    const result = await getRepository(StateEntity).find({
      where: { id: createdState.id },
      relations: ['cities'],
    })

    expect(result[0].cities[0].id).toBe(createdCity.id)
  })

  it('validate if DistrictEntity foreign keys has been set', async () => {
    const createdState = await createState()
    const createdCity = await createCity(createdState.id)
    const createdDistrict = await createDistrict(createdCity.id)

    const result = await getRepository(CityEntity).find({
      where: { id: createdCity.id },
      relations: ['districts'],
    })

    expect(result[0].districts[0].id).toBe(createdDistrict.id)
  })

  it('validate if PublicStateEntity foreign keys has been set', async () => {
    const createdState = await createState()
    const createdCity = await createCity(createdState.id)
    const createdDistrict = await createDistrict(createdCity.id)
    const createdPublicPlace = await createPublicPlace(createdDistrict.id)

    const result = await getRepository(DistrictEntity).find({
      where: { id: createdDistrict.id },
      relations: ['publicPlaces'],
    })

    expect(result[0].publicPlaces[0].id).toBe(createdPublicPlace.id)
  })

  it('validate if AddressEntity foreign keys has been set', async () => {
    const createdState = await createState()
    const createdCity = await createCity(createdState.id)
    const createdDistrict = await createDistrict(createdCity.id)
    const createdPublicPlace = await createPublicPlace(createdDistrict.id)
    const createdAddress = await createAddress(
      createdState.id,
      createdCity.id,
      createdDistrict.id,
      createdPublicPlace.id,
    )

    const result = await getRepository(AddressEntity).find({
      where: { id: createdAddress.id },
      relations: ['state', 'city', 'district', 'publicPlace'],
    })

    expect(result[0].state.id).toBe(createdState.id)
    expect(result[0].city.id).toBe(createdCity.id)
    expect(result[0].district.id).toBe(createdDistrict.id)
    expect(result[0].publicPlace.id).toBe(createdPublicPlace.id)
  })
})
