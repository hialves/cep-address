import { Entity, Column, OneToMany } from 'typeorm'
import { CityEntity } from '.'
import { EntityBase } from './base'

export interface IState {
  name: string
  uf: string
  cities: CityEntity[]
}

@Entity({ name: 'state' })
class State extends EntityBase implements IState {
  @Column()
  name: string

  @Column()
  uf: string

  @OneToMany(() => CityEntity, (city) => city.state)
  cities: CityEntity[]
}

export default State
