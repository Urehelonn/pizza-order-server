import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {User} from "../entity/User";

export class addAdminUser1568698439679 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new User();
        user.username = "admin";
        user.password = "admin";
        user.role = ["admin"];

        user.hashPassword();
        const repo = getRepository(User);
        await repo.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
