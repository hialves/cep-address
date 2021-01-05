import { HttpException } from './http.exception'

export class AddressNotFoundException extends HttpException {
  constructor() {
    super(404, `Address not found`)
  }
}
