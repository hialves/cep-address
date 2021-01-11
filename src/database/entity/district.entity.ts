import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'
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
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @Column()
  name: string

  @IsNotEmpty()
  @ManyToOne(() => CityEntity, (city) => city.id, {
    nullable: false,
    cascade: ['remove', 'update'],
  })
  city: CityEntity

  @OneToMany(() => PublicPlaceEntity, (publicPlace) => publicPlace.district)
  publicPlaces: PublicPlaceEntity[]
}

export default District
