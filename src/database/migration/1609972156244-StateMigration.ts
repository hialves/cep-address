import {MigrationInterface, QueryRunner} from "typeorm";

export class StateMigration1609972156244 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "state" (
				id serial PRIMARY KEY, 
        name VARCHAR (50) NOT NULL, 
        uf VARCHAR (2) NOT NULL,
				created_at TIMESTAMP DEFAULT NOW(), 
				updated_at TIMESTAMP DEFAULT NOW()
			);`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "state";')
  }
  
}
