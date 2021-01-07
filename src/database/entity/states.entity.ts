import { Entity, Column, OneToMany } from 'typeorm'
import { CityEntity } from '.'
import { EntityBase } from './base'

export interface IStates {
  name: string
}

@Entity({ name: 'state' })
class States extends EntityBase implements IStates {
  @Column()
  name: string

  @OneToMany(() => CityEntity, (city) => city.state)
  city: CityEntity
}

export default States
