import { Entity, Column, ManyToOne } from 'typeorm'
import { DistrictEntity } from '.'
import { EntityBase } from './base'

export interface IPublicPlaces {
  name: string
}

@Entity({ name: 'public_place' })
class PublicPlaces extends EntityBase implements IPublicPlaces {
  @Column()
  name: string

  @ManyToOne(() => DistrictEntity, (district) => district.id)
  district: DistrictEntity
}

export default PublicPlaces
