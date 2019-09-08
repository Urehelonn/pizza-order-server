import {Column, Entity, Index} from "typeorm";
import {Product, ProductType} from "./Product";
import {ProductProfile} from "./PizzaHelper";
import {Category, CategoryType} from "./Category";

@Entity()
export class Topping extends Product {

    @Column()
    halal: boolean;

    constructor(name: string, desc: string, img: string,
                type: ProductType = ProductType.accessory,
                profiles: ProductProfile[],
                category: Category[] = [{type: CategoryType.Topping, description: '', featured: false}],
                inStock: boolean = false,
                deleted: boolean = false,
                halal: boolean = false,
                currency: string = '$') {
        super(name, desc, img, type, profiles,
            category, inStock, deleted, currency);
        this.halal = halal;
    }
}