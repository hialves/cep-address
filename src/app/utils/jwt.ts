import jwt, { Secret } from 'jsonwebtoken'
import { AdminEntity } from '@entity/index'

export const generateToken = (admin: AdminEntity) => {
  let token = jwt.sign({ id: admin.id }, <Secret>process.env.JWT_KEY, {
    expiresIn: 60 * 60 * 12,
  })
  return token
}
