import {MigrationInterface, QueryRunner} from "typeorm";

export class PublicPlacesMigration1609972428039 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "public_place" (
				id serial PRIMARY KEY, 
				name VARCHAR (50) NOT NULL, 
				created_at TIMESTAMP DEFAULT NOW(), 
				updated_at TIMESTAMP DEFAULT NOW()
			);`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "public_place";')
  }
  
}
