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

export function ContentNotFound(
  res: Response,
  field: string,
  id: number | string,
) {
  res.status(404).json({ field, message: `${field} not found with id: ${id}` })
}

export function FieldInUse(res: Response, field: string, value: any) {
  res.status(409).json({ field, message: `${field} (${value}) already in use` })
}

export function InvalidFieldValue(res: Response, field: string) {
  res
    .status(400)
    .json({ field, message: `A valid ${field} field must be provided` })
}
