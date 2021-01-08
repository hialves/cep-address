import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { CityEntity, PublicPlaceEntity } from '.'
import { EntityBase } from './base'

export interface IDistrict {
  name: string
  city: CityEntity
  publicPlaces: PublicPlaceEntity[]
}

@Entity({ name: 'district' })
class District extends EntityBase implements IDistrict {
  @Column()
  name: string

  @ManyToOne(() => CityEntity, (city) => city.id)
  city: CityEntity

  @OneToMany(() => PublicPlaceEntity, (publicPlace) => publicPlace.district)
  publicPlaces: PublicPlaceEntity[]
}

export default District
