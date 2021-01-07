import { Column, PrimaryGeneratedColumn } from 'typeorm'

export abstract class EntityBase {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: new Date() })
  created_at: string

  @Column({ default: new Date() })
  updated_at: string
}
