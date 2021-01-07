import {MigrationInterface, QueryRunner} from "typeorm";

export class AddressMigration1609972270179 implements MigrationInterface {
  
  public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "address" (
				id serial PRIMARY KEY, 
        cep VARCHAR (8) NOT NULL, 
        complement VARCHAR (255),
				created_at TIMESTAMP DEFAULT NOW(), 
				updated_at TIMESTAMP DEFAULT NOW()
			);`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "address";')
  }
  
}