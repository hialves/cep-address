import { capitalizeFirst } from '@utils/helpers'
import { HttpException } from './http.exception'

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    console.log(message)

    super(500, `Internal Server Error`)
  }
}

export class InvalidFieldValueException extends HttpException {
  constructor(field: string) {
    super(422, `${capitalizeFirst(field)} a valid must be provided`)
  }
}
