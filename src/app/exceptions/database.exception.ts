import { capitalizeFirst } from '@utils/helpers'
import { HttpException } from './http.exception'

export class FieldAlreadyInUseException extends HttpException {
  constructor(field: string, value: string) {
    super(409, `${capitalizeFirst(field)} ${value} already in use`)
  }
}
