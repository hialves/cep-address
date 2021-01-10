import isEmail from 'isemail'
import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import {
  ContentNotFoundException,
  InternalServerErrorException,
} from '@exceptions/index'
import { ContentDeleted, JsonResponse } from '@utils/responses'
import { LoginException } from '@exceptions/auth.exception'
import { compareHash } from '@utils/helpers'
import { generateToken } from '@utils/jwt'
import { checkIfExists } from '@utils/repository'
import { AdminEntity } from '@entity/index'

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      const adminRepository = getRepository(AdminEntity)
      let admin = null

      if (isEmail.validate(email)) {
        admin = await checkIfExists<AdminEntity>(
          adminRepository,
          'email',
          email,
        )
      }

      if (admin) {
        if (await compareHash(password, admin.password)) {
          JsonResponse(res, { ...admin, token: generateToken(admin) })
        } else {
          next(new LoginException())
        }
      } else {
        next(new LoginException())
      }
    } catch (e) {
      next(new InternalServerErrorException(e))
    }
  }
}

export default new AuthController()
