import faker from 'faker/locale/pt_BR'

import {
  AddressEntity,
  CityEntity,
  DistrictEntity,
  PublicPlaceEntity,
  StateEntity,
} from '@entity/index'
import * as data from '../data.json'

import { getRepository } from 'typeorm'

interface EntityTestOptions {
  save: boolean
}

export async function createAddress(
  stateId: any,
  cityId: any,
  districtId: any,
  publicPlaceId: any,
  options: EntityTestOptions = { save: true },
) {
  const address = new AddressEntity()
  address.cep = data.address.cep
  address.complement = faker.address.streetName()
  address.state = stateId
  address.city = cityId
  address.district = districtId
  address.publicPlace = publicPlaceId

  if (options.save) return await getRepository(AddressEntity).save(address)
  return address
}

export async function createState(options: EntityTestOptions = { save: true }) {
  const state = new StateEntity()
  state.name = faker.address.state()
  state.uf = faker.address.stateAbbr()

  if (options.save) return await getRepository(StateEntity).save(state)
  return state
}

export async function createCity(
  id: any,
  options: EntityTestOptions = { save: true },
) {
  const city = new CityEntity()
  city.name = faker.address.city()
  city.state = id

  if (options.save) return await getRepository(CityEntity).save(city)
  return city
}

export async function createDistrict(
  id: any,
  options: EntityTestOptions = { save: true },
) {
  const district = new DistrictEntity()
  district.name = faker.address.county()
  district.city = id

  if (options.save) return await getRepository(DistrictEntity).save(district)
  return district
}

export async function createPublicPlace(
  id: any,
  options: EntityTestOptions = { save: true },
) {
  const publicPlace = new PublicPlaceEntity()
  publicPlace.name = faker.address.streetAddress()
  publicPlace.district = id

  if (options.save)
    return await getRepository(PublicPlaceEntity).save(publicPlace)
  return publicPlace
}
