import { Response } from 'express'

export function JsonResponse<T>(res: Response, json: Object | Array<T>) {
  res.status(200).json(json)
}

export function JsonErrorValidation<T>(res: Response, json: Object | Array<T>) {
  res.status(422).json(json)
}
