import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AdressForeignKeys1609975688343 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('address', new TableColumn({name: 'districtId', type: 'integer'}))
    await queryRunner.addColumn('address', new TableColumn({name: 'cityId', type: 'integer'}))
    await queryRunner.addColumn('address', new TableColumn({name: 'stateId', type: 'integer'}))
    await queryRunner.addColumn('address', new TableColumn({name: 'public_placeId', type: 'integer'}))

    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['districtId'],
        referencedTableName: 'district',
        referencedColumnNames: ['id']
      })
    )
    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['cityId'],
        referencedTableName: 'city',
        referencedColumnNames: ['id']
      })
    )
    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['stateId'],
        referencedTableName: 'state',
        referencedColumnNames: ['id']
      })
    )
    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['public_placeId'],
        referencedTableName: 'public_place',
        referencedColumnNames: ['id']
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('address', 'districtId')
    await queryRunner.dropColumn('address', 'cityId')
    await queryRunner.dropColumn('address', 'stateId')
    await queryRunner.dropColumn('address', 'public_placeId')
  }

}
