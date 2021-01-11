import { IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator'
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
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @Column()
  name: string

  @Length(2, 2)
  @IsNotEmpty()
  @Column()
  uf: string

  @OneToMany(() => CityEntity, (city) => city.state)
  cities: CityEntity[]
}

export default State
