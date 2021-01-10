import {MigrationInterface, QueryRunner} from "typeorm";

export class AdminMigration1610245244101 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "admin" (
				id serial PRIMARY KEY, 
        name VARCHAR (100) NOT NULL, 
        email VARCHAR (100) NOT NULL,
        password VARCHAR (255) NOT NULL,
				created_at TIMESTAMP DEFAULT NOW(), 
				updated_at TIMESTAMP DEFAULT NOW()
			);`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "admin";')
  }
  

}
