import { HttpException } from './http.exception'

export class UnauthorizedException extends HttpException {
  constructor() {
    super(401, `Unauthorized route`)
  }
}

export class LoginException extends HttpException {
  constructor() {
    super(401, 'Credentials invalid')
  }
}
