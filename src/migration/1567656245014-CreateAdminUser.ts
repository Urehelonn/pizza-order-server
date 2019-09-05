import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";

export class CreateAdminUser1567656245014 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.username = "admin";
        user.password = "admin";
        user.role = "ADMIN";
        const repo = getRepository(User);
        await repo.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
