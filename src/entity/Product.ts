import {Column, Entity, Index, ObjectID, ObjectIdColumn, Unique} from "typeorm";
import {Category} from "./Category";
import {ProductProfile} from "./PizzaHelper";

export enum ProductType {
    product = 'product', //can be sold separately
    accessory = 'accessory', //a part of a main product, cannot be sold separately
    coupon = 'coupon'
}

@Entity()
@Unique(['name'])   // generic features, base class
export class Product {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    @Index({unique: true})
    name: string;

    @Column()
    category: Category[];

    @Column()
    profiles: ProductProfile[];

    @Column()
    type: ProductType;

    @Column()
    description: string;

    @Column()
    img: string;

    @Column()
    inStock: boolean;

    @Column()
    delete: boolean;

    @Column()
    currency: string;

    constructor(
        name: string, desc: string,
        img: string, type: ProductType,
        profiles: ProductProfile[],
        category: Category[],
        inStock: boolean = false,
        deleted: boolean = false,
        currency: string = '$'
    ) {
        this.name = name;
        this.description = desc;
        this.profiles = profiles;
        this.img = img;
        this.type = type;
        this.category = category;
        this.inStock = inStock;
        this.delete = deleted;
        this.currency = currency;
    }
}