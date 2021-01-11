import { isCep } from '@utils/helpers'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'

@ValidatorConstraint({ name: 'isCep', async: false })
export class IsCep implements ValidatorConstraintInterface {
  validate(cep: string, args: ValidationArguments) {
    return isCep(cep)
  }

  defaultMessage(args: ValidationArguments) {
    return 'Cep ($value) is invalid'
  }
}
