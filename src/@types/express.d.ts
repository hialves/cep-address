import { AdminEntity } from '@entity/index'

declare global {
  namespace Express {
    export interface Request {
      admin: AdminEntity
    }
  }
}
