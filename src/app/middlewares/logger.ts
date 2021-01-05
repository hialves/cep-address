import { NextFunction, Request, Response } from 'express'

export const logger = (req: Request, res: Response, next: NextFunction) => {
  process.env.NODE_ENV !== 'test' && console.log(`${req.method} ${req.path}`)

  next()
}
