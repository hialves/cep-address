import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { Entity, Column, ManyToOne } from 'typeorm'
import { DistrictEntity } from '.'
import { EntityBase } from './base'

export interface IPublicPlace {
  name: string
  district: DistrictEntity
}

@Entity({ name: 'public_place' })
class PublicPlace extends EntityBase implements IPublicPlace {
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @Column()
  name: string

  @IsNotEmpty()
  @ManyToOne(() => DistrictEntity, (district) => district.id, {
    nullable: false,
    cascade: ['remove', 'update'],
  })
  district: DistrictEntity
}

export default PublicPlace
