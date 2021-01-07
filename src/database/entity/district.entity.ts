import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { CityEntity, PublicPlaceEntity } from '.'
import { EntityBase } from './base'

export interface IDistricts {
  name: string
}

@Entity({ name: 'district' })
class Districts extends EntityBase implements IDistricts {
  @Column()
  name: string

  @ManyToOne(() => CityEntity, (city) => city.id)
  city: CityEntity

  @OneToMany(() => PublicPlaceEntity, (publicPlace) => publicPlace.district)
  publicPlace: PublicPlaceEntity
}

export default Districts
