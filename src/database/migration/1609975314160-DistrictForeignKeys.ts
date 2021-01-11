import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class DistrictForeignKeys1609975314160 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('district', new TableColumn({name: 'cityId', type: 'integer'}))

    await queryRunner.createForeignKey(
      'district',
      new TableForeignKey({
        columnNames: ['cityId'],
        referencedTableName: 'city',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('district', 'cityId')
  }

}
