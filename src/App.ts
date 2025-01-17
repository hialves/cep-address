import 'reflect-metadata'

import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import { createConnection } from 'typeorm'

import * as routes from '@routes/index'
import { errorHandler } from '@middlewares/error'
import { logger } from '@middlewares/logger'
import { RouteNotImplementedException } from '@exceptions/index'

class App {
  public app: express.Application
  public connection: http.Server

  constructor() {
    this.app = express()

    this.initializeMiddlewares()
    this.initializeRoutes()
    this.connectToTheDatabase()
  }

  public listen() {
    this.connection = this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`)
    })
  }

  public close() {
    this.connection.close()
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(logger)
  }

  private initializeRoutes() {
    Object.values(routes).forEach((router) => {
      this.app.use(router)
    })

    //handle non existent routes
    this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
      next(new RouteNotImplementedException(req.path))
    })

    this.app.use(errorHandler)
  }

  private async connectToTheDatabase() {
    await createConnection()
  }
}

export default App
