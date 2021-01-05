import { Request, Response } from 'express'

import { JsonResponse } from '@utils/responses'

class CepController {
  async find(req: Request, res: Response) {
    // TODO
    JsonResponse(res, {})
  }
}

export default new CepController()
