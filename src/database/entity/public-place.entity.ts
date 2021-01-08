import { Entity, Column, ManyToOne } from 'typeorm'
import { DistrictEntity } from '.'
import { EntityBase } from './base'

export interface IPublicPlace {
  name: string
  district: DistrictEntity
}

@Entity({ name: 'public_place' })
class PublicPlace extends EntityBase implements IPublicPlace {
  @Column()
  name: string

  @ManyToOne(() => DistrictEntity, (district) => district.id)
  district: DistrictEntity
}

export default PublicPlace
