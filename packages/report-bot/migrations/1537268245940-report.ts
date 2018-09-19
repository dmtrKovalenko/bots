import { MigrationInterface, QueryRunner } from "typeorm";

export class report1537268245940 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.reports (
          telegram_id character varying(64) NOT NULL,
          month DATE NOT NULL,
          minutes int NOT NULL DEFAULT 0,
          publications int NOT NULL DEFAULT 0,
          visits int NOT NULL DEFAULT 0,
          videos int NOT NULL DEFAULT 0,
          PRIMARY KEY(telegram_id, month)
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TABLE "reports"`);
    }
}
