import { EntityBase } from './base'
import { Entity, Column } from 'typeorm'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

export interface IAdmin {
  name: string
  email: string
  password: string
}

@Entity({ name: 'admin' })
class Admin extends EntityBase implements IAdmin {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  @Column({ nullable: false })
  name: string

  @IsEmail()
  @IsNotEmpty()
  @Column({ unique: true, nullable: false })
  email: string

  @IsString()
  @IsNotEmpty()
  @Min(8)
  @Column({ select: false, nullable: false })
  password: string
}

export default Admin
