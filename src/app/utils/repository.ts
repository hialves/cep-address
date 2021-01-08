import { Repository } from 'typeorm'

export async function checkIfExists<T>(
  repository: Repository<T>,
  key: string,
  value: any,
) {
  return await repository.findOne({
    where: `${key} ILIKE '%${value}%'`,
  })
}
