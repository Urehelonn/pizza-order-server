import {Entity, ObjectIdColumn, ObjectID, Column, CreateDateColumn, UpdateDateColumn, Index} from "typeorm";
import {IsNotEmpty, Length} from "class-validator";
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    @Length(4, 20)
    @Index({ unique: true })
    username: string;

    @Column()
    @Length(4, 20)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createAt: Date;


    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword(){
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
