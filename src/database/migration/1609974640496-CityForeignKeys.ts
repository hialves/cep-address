import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class CityForeignKeys1609974640496 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('city', new TableColumn({name: 'stateId', type: 'smallint'}))

    await queryRunner.createForeignKey(
      'city',
      new TableForeignKey({
        columnNames: ['stateId'],
        referencedTableName: 'state',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('city', 'stateId')
  }

}
