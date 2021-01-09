import { HttpException } from './http.exception'

export class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    console.log(message)

    super(500, `Internal Server Error`)
  }
}

export class InvalidFieldValueException extends HttpException {
  constructor(field: string) {
    super(422, `A valid ${field} field must be provided`)
  }
}

export class ContentNotFoundException extends HttpException {
  constructor(id: string | number, field?: string) {
    super(404, `${field || 'Content'} not found with id: ${id}`)
  }
}

export class RouteNotImplementedException extends HttpException {
  constructor(path: string) {
    super(400, path)
  }
}

export class CustomException extends HttpException {
  constructor(message: string, status: number = 400) {
    super(status, message)
  }
}
