import { HttpException } from '@exceptions/index'
import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { status, message } = err

  res.status(status).json({ message })
}
