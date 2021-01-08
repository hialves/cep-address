import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { DistrictEntity, StateEntity } from '.'
import { EntityBase } from './base'

export interface ICity {
  name: string
  state: StateEntity
  districts: DistrictEntity[]
}

@Entity({ name: 'city' })
class City extends EntityBase implements ICity {
  @Column()
  name: string

  @ManyToOne(() => StateEntity, (state) => state.id)
  state: StateEntity

  @OneToMany(() => DistrictEntity, (district) => district.city)
  districts: DistrictEntity[]
}

export default City
