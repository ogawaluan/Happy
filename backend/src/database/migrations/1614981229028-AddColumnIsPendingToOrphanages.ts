import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export default class AddColumnIsPendingToOrphanages1614981229028 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn('orphanages', new TableColumn({
			name: 'is_pending',
			type: 'boolean',
			default: false,
		}));
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn('orphanages', 'is_pending');
	}
}
