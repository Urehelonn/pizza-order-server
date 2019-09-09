import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {Topping} from "../entity/Topping";
import {ProductType} from "../entity/Product";
import {CategoryType} from "../entity/Category";
import {PizzaSizeType, ProductProfile} from "../entity/PizzaHelper";
import {Pizza} from "../entity/Pizza";

export class PizzaNoToppingsFix1567981290794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        //get toppings id
        let topRepo = getRepository(Topping);
        let tops = await topRepo.find();
        let topIds = [];
        for (let i = 0; i < tops.length; i++) {
            topIds.push(tops[i].id);
        }

        // Create Pizza
        let profiles: ProductProfile[] = [
            {name: PizzaSizeType.S, price: 4.99, default: true},
            {name: PizzaSizeType.M, price: 7.99, default: false},
            {name: PizzaSizeType.L, price: 10.99, default: false},
            {name: PizzaSizeType.XL, price: 14.99, default: false},
        ];
        const pizzaName: string[] = [
            "Plain Ol' Pepperoni",
            "FRESCO - TRIO POMMODORO",
            "BUFFALO CHICKEN",
            "CHIPOTLE STEAK",
            "BIG BACON BONANZA"
        ];

        let pizzaRepo = getRepository(Pizza);
        for (let i = 0; i < pizzaName.length; i++) {
            let pizza = new Pizza(topIds, pizzaName[i], '', '',
                ProductType.product, profiles,
                [{type: CategoryType.Pizza, description: ''}], true);
            await pizzaRepo.save(pizza);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
