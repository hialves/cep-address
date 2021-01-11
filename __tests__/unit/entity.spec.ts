import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })
import faker from 'faker/locale/pt_BR'

import { createConnection, getConnection } from 'typeorm'
import { validate } from 'class-validator'

import {
  AddressEntity,
  StateEntity,
  CityEntity,
  DistrictEntity,
  PublicPlaceEntity,
} from '@entity/index'
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

  const id: any = 1

  it('validates AddressEntity', async () => {
    const address = await createAddress(id, id, id, id, { save: false })

    const errors = await validate(address)

    expect(errors.length).toBe(0)
  })

  it('doesnt validate AddressEntity', async () => {
    const address = new AddressEntity()
    address.cep = '01010'
    address.complement = faker.helpers.repeatString('x', 256)

    const errors = await validate(address)

    expect(errors.length).toBe(6)
  })

  it('validates StateEntity', async () => {
    const state = await createState({ save: false })

    const errors = await validate(state)

    expect(errors.length).toBe(0)
  })

  it('doesnt validates StateEntity', async () => {
    const state = new StateEntity()
    state.name = faker.helpers.repeatString('x', 51)
    state.uf = faker.helpers.repeatString('x', 3)

    const errors = await validate(state)

    expect(errors.length).toBe(2)
  })

  it('validates CityEntity', async () => {
    const city = await createCity(id, { save: false })

    const errors = await validate(city)

    expect(errors.length).toBe(0)
  })

  it('doesnt validates CityEntity', async () => {
    const city = new CityEntity()
    city.name = faker.helpers.repeatString('x', 51)

    const errors = await validate(city)

    expect(errors.length).toBe(2)
  })

  it('validates DistrictEntity', async () => {
    const district = await createDistrict(id, { save: false })

    const errors = await validate(district)

    expect(errors.length).toBe(0)
  })

  it('doesnt validates DistrictEntity', async () => {
    const district = new DistrictEntity()
    district.name = faker.helpers.repeatString('x', 51)

    const errors = await validate(district)

    expect(errors.length).toBe(2)
  })

  it('validates PublicPlaceEntity', async () => {
    const publicPlace = await createPublicPlace(id, { save: false })

    const errors = await validate(publicPlace)

    expect(errors.length).toBe(0)
  })

  it('doesnt validates PublicPlaceEntity', async () => {
    const publicPlace = new PublicPlaceEntity()
    publicPlace.name = faker.helpers.repeatString('x', 51)

    const errors = await validate(publicPlace)

    expect(errors.length).toBe(2)
  })
})
