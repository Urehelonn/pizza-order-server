import {Column, Entity, Index, ObjectID, ObjectIdColumn} from "typeorm";
import {IsNotEmpty} from "class-validator";

export enum CategoryType {
    Pizza = 'pizza',
    Drink = 'drink',
    Topping = 'topping'
}

@Entity()
export class Category {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    @IsNotEmpty()
    @Index({unique: true})
    type: CategoryType;

    @Column()
    description: string;

    @Column()
    featured?: boolean; // set the category to the top

    constructor(
        type: CategoryType,
        des: string = '',
        featured: boolean = false
    ) {
        this.type = type;
        this.description = des;
        this.featured = featured;
    }
}