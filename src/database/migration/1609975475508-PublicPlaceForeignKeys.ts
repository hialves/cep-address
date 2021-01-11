import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class PublicPlaceForeignKeys1609975475508 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('public_place', new TableColumn({name: 'districtId', type: 'integer'}))

    await queryRunner.createForeignKey(
      'public_place',
      new TableForeignKey({
        columnNames: ['districtId'],
        referencedTableName: 'district',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('public_place', 'districtId')
  }

}
