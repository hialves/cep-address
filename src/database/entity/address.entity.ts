import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { CityEntity, DistrictEntity, PublicPlaceEntity, StateEntity } from '.'
import { EntityBase } from './base'

export interface IAddress {
  cep: string
  complement: string
  state: StateEntity
  city: CityEntity
  district: DistrictEntity
  publicPlace: PublicPlaceEntity
}

@Entity({ name: 'address' })
class Address extends EntityBase implements IAddress {
  @Column()
  cep: string

  @Column()
  complement: string

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
