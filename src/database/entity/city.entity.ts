import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { DistrictEntity, StateEntity } from '.'
import { EntityBase } from './base'

export interface ICities {
  name: string
}

@Entity({ name: 'city' })
class Cities extends EntityBase implements ICities {
  @Column()
  name: string

  @ManyToOne(() => StateEntity, (state) => state.id)
  state: StateEntity

  @OneToMany(() => DistrictEntity, (district) => district.city)
  district: DistrictEntity
}

export default Cities
