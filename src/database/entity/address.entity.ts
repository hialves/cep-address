import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { CityEntity, DistrictEntity, PublicPlaceEntity, StateEntity } from '.'
import { EntityBase } from './base'

export interface IAddress {
  cep: string
}

@Entity({ name: 'address' })
class Address extends EntityBase implements IAddress {
  @Column()
  cep: string

  @OneToOne(() => StateEntity)
  @JoinColumn()
  state: StateEntity

  @OneToOne(() => CityEntity)
  @JoinColumn()
  city: CityEntity

  @OneToOne(() => DistrictEntity)
  @JoinColumn()
  district: DistrictEntity

  @OneToOne(() => PublicPlaceEntity)
  @JoinColumn()
  publicPlace: PublicPlaceEntity
}

export default Address
