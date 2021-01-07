import {MigrationInterface, QueryRunner} from "typeorm";

export class CityMigration1609971966166 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "city" (
				id serial PRIMARY KEY, 
        name VARCHAR (50) NOT NULL, 
				created_at TIMESTAMP DEFAULT NOW(), 
				updated_at TIMESTAMP DEFAULT NOW()
			);`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "city";')
  }
  
}
