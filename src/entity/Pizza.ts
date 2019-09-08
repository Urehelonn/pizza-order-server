import {Column, Entity, Unique} from "typeorm";
import {Product, ProductType} from "./Product";
import {ProductProfile} from "./PizzaHelper";
import {Category, CategoryType} from "./Category";

@Entity()
@Unique(['name'])
export class Pizza extends Product {
    @Column()
    halal: boolean;

    @Column()
    toppings: string[]

    constructor(
        name: string,
        toppings: string[],
        desc: string,
        img: string,
        type: ProductType = ProductType.product,
        profiles: ProductProfile[],
        category: Category[] = [
            {type: CategoryType.Pizza, description: '', featured: false}
        ],
        inStock: boolean = false,
        deleted: boolean = false,
        currency: string = '$',
        halal: boolean = false,
    ){
        super(name, desc, img, type, profiles,
            category, inStock, deleted, currency);
        this.halal = halal;
    }

}