import { getConnection } from 'typeorm'

export const truncate = async () => {
  const entities = getConnection().entityMetadatas

  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name)
    await repository.delete({})
  }
}

export const revertMigrations = async () => {
  for (let i in getConnection().migrations) {
    await getConnection().undoLastMigration()
  }
  return Promise.resolve()
}
