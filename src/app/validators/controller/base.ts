import { isValid } from '@utils/helpers'
import { InvalidFieldValue } from '@utils/responses'
import { NextFunction, Request, Response } from 'express'

export abstract class BaseValidator {
  static async find(req: Request, res: Response, next: NextFunction) {
    const { search } = req.params

    if (!isValid(search)) {
      InvalidFieldValue(res, 'search')
    } else {
      next()
    }
  }
}
