import { IsCep } from '@utils/custom-decorators'
import { IsNotEmpty, Length, Validate } from 'class-validator'
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm'
import { CityEntity, DistrictEntity, PublicPlaceEntity, StateEntity } from '.'
import { EntityBase } from './base'

export interface IAddress {
  cep: string
  complement: string
  state: StateEntity
  city: CityEntity
  district: DistrictEntity
  publicPlace: PublicPlaceEntity
}

@Entity({ name: 'address' })
class Address extends EntityBase implements IAddress {
  @Length(8, 8)
  @Validate(IsCep)
  @IsNotEmpty()
  @Column()
  cep: string

  @Length(0, 255)
  @Column()
  complement: string

  @IsNotEmpty()
  @OneToOne(() => StateEntity, {
    nullable: false,
    cascade: ['remove', 'update'],
  })
  @JoinColumn()
  state: StateEntity

  @IsNotEmpty()
  @OneToOne(() => CityEntity, {
    nullable: false,
    cascade: ['remove', 'update'],
  })
  @JoinColumn()
  city: CityEntity

  @IsNotEmpty()
  @OneToOne(() => DistrictEntity, {
    nullable: false,
    cascade: ['remove', 'update'],
  })
  @JoinColumn()
  district: DistrictEntity

  @IsNotEmpty()
  @OneToOne(() => PublicPlaceEntity, {
    nullable: false,
    cascade: ['remove', 'update'],
  })
  @JoinColumn()
  publicPlace: PublicPlaceEntity
}

export default Address
