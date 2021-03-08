import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterIsPendingDefaultToTrue1615233358903 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn('orphanages', 
			new TableColumn({
				name: 'is_pending',
				type: 'boolean',
				default: false,
			}), 
			new TableColumn({
				name: 'is_pending',
				type: 'boolean',
				default: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.changeColumn('orphanages', 
			new TableColumn({
				name: 'is_pending',
				type: 'boolean',
				default: true,
			}), 
			new TableColumn({
				name: 'is_pending',
				type: 'boolean',
				default: false,
			}),
		);
	}
}
