import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { DistrictEntity, StateEntity } from '.'
import { EntityBase } from './base'

export interface ICity {
  name: string
  state: StateEntity
  districts: DistrictEntity[]
}

@Entity({ name: 'city' })
class City extends EntityBase implements ICity {
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @Column()
  name: string

  @IsNotEmpty()
  @ManyToOne(() => StateEntity, (state) => state.id, {
    nullable: false,
    cascade: ['remove', 'update'],
  })
  state: StateEntity

  @OneToMany(() => DistrictEntity, (district) => district.city)
  districts: DistrictEntity[]
}

export default City
