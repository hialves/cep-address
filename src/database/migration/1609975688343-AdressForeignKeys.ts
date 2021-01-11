import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AdressForeignKeys1609975688343 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('address', new TableColumn({name: 'districtId', type: 'integer'}))
    await queryRunner.addColumn('address', new TableColumn({name: 'cityId', type: 'integer'}))
    await queryRunner.addColumn('address', new TableColumn({name: 'stateId', type: 'integer'}))
    await queryRunner.addColumn('address', new TableColumn({name: 'publicPlaceId', type: 'integer'}))

    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['districtId'],
        referencedTableName: 'district',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    )
    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['cityId'],
        referencedTableName: 'city',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    )
    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['stateId'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    )
    await queryRunner.createForeignKey(
      'address',
      new TableForeignKey({
        columnNames: ['publicPlaceId'],
        referencedTableName: 'public_place',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('address', 'districtId')
    await queryRunner.dropColumn('address', 'cityId')
    await queryRunner.dropColumn('address', 'stateId')
    await queryRunner.dropColumn('address', 'publicPlaceId')
  }

}
