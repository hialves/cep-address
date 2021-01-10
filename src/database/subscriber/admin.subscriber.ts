import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'

import { AdminEntity } from '@entity/index'
import { hashPassword } from '@utils/helpers'

@EventSubscriber()
export class AdminSubscriber implements EntitySubscriberInterface<AdminEntity> {
  listenTo() {
    return AdminEntity
  }

  async beforeInsert(event: InsertEvent<AdminEntity>) {
    event.entity.password = await hashPassword(event.entity.password)
  }
}
