import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import { CityEntity, StateEntity } from '@entity/index'
import { createConnection, getConnection, getRepository } from 'typeorm'
import { revertMigrations, truncate } from '../utils/database'

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

  it('validate if foreign key has been set', async () => {
    let state = new StateEntity()
    state.name = 'São Paulo'
    state.uf = 'SP'

    const createdState = await getRepository(StateEntity).save(state)

    let city = new CityEntity()
    city.name = 'Campinas'
    city.state = <any>createdState.id

    const createdCity = await getRepository(CityEntity).save(city)

    const result = await getRepository(StateEntity).find({
      where: { id: createdState.id },
      relations: ['cities'],
    })

    expect(result[0].cities[0].id).toBe(createdCity.id)
  })
})
