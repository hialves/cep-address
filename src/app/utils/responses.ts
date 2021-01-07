import { Response } from 'express'

export function ContentCreated(res: Response, json: Object) {
  res.status(201).json(json)
}

export function ContentDeleted(res: Response) {
  res.status(200).json()
}

export function JsonResponse<T>(res: Response, json: Object | Array<T> | T) {
  res.status(200).json(json)
}

export function JsonErrorValidation<T>(res: Response, json: Object | Array<T>) {
  res.status(422).json(json)
}
