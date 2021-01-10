import jwt, { Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { AdminEntity } from '@entity/index'
import { getRepository } from 'typeorm'
import { UnauthorizedException } from '@exceptions/index'

export interface DataStoredInToken {
  id: number
}

export const restrict = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('authorization')

  if (token) {
    const decoded = jwt.verify(
      token,
      <Secret>process.env.JWT_KEY,
    ) as DataStoredInToken

    const admin = await getRepository(AdminEntity).findOne(decoded.id)

    if (admin) {
      req.admin = admin

      next()
    } else {
      next(new UnauthorizedException())
    }
  } else {
    next(new UnauthorizedException())
  }
}
