import { EntityBase } from './base'
import { Entity, Column } from 'typeorm'

export interface IAdmin {
  name: string
  email: string
  password: string
}

@Entity({ name: 'admin' })
class Admin extends EntityBase implements IAdmin {
  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string
}

export default Admin
