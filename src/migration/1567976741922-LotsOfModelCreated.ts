import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {Category, CategoryType} from "../entity/Category";
import {Topping} from "../entity/Topping";
import {ProductType} from "../entity/Product";
import {PizzaSizeType, ProductProfile} from "../entity/PizzaHelper";
import {Pizza} from "../entity/Pizza";
import {Drink} from "../entity/Drink";

export class LotsOfModelCreated1567976741922 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        //Create categories
        let catArr: Category[] = [
            {type: CategoryType.Pizza, description: '', featured: true},
            {type: CategoryType.Topping, description: '', featured: false},
            {type: CategoryType.Drink, description: '', featured: false},
        ];
        let catRepo = getRepository(Category);
        for (let i = 0; i < catArr.length; i++) {
            await catRepo.save(catArr[i]);
        }

        //Create toppings
        let toppings: Topping[] = [
            new Topping('basil', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: true}],
                true, false),
            new Topping('anchovy', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: false}],
                true, false),
            new Topping('mozzarella', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: false}],
                true, false),
            new Topping('bacon', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: false}],
                true, true),
            new Topping('olive', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: false}],
                true, false),
            new Topping('onion', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: false}],
                true, false),
            new Topping('tomato', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: false}],
                true, true),
            new Topping('mushroom', '', '', ProductType.accessory,
                [{name: 'top', price: 1.22, default: true, selected: false}],
                [{type: CategoryType.Topping, description: '', featured: false}],
                true, false),
        ];
        let topRepo = getRepository(Topping);
        let topIds: string[] = [];
        for (let i = 0; i < toppings.length; i++) {
            let res = await topRepo.save(toppings[i]);
            toppings[i].id = res.id;
            topIds.push(res.id.toString());
        }

        // Create Pizza
        let profiles: ProductProfile[] = [
            {name: PizzaSizeType.S, price: 4.99, default: true, selected: false},
            {name: PizzaSizeType.M, price: 7.99, default: false, selected: false},
            {name: PizzaSizeType.L, price: 10.99, default: false, selected: false},
            {name: PizzaSizeType.XL, price: 14.99, default: false, selected: false},
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
            let pizza = new Pizza(topIds, pizzaName[i],'', '',
                ProductType.product, profiles,
                [{type: CategoryType.Pizza, description: ''}], true);
            await pizzaRepo.save(pizza);
        }

        //create drinks
        let drinkNames: string[] = [
            'COCA-COLA 6 PACK GLASS BOTTLE',
            'CAN POP',
            'VARIETY 3 PACK',
            'VARIETY 6 PACK',
            'BOTTLE POP',
            'BRIO'
        ]

        let drinkDes: string[] = [
            '200 Cals/bottle',
            '0 tp 160 Cals/can',
            '0 tp 160 Cals/can',
            '0 tp 200 Cals/can',
            '0 tp 220 Cals/can',
            '160 Cals',
        ];

        let drinkProfiles: ProductProfile[][] = [
            [{price: 4.99, default: true, name: '', selected: false}],
            [{price: 1.29, default: true, name: '', selected: false}],
            [{price: 3.49, default: true, name: '', selected: false}],
            [{price: 4.49, default: true, name: '', selected: false}],
            [{price: 2.29, default: true, name: '', selected: false}],
            [{price: 2.29, default: true, name: '', selected: false}],
        ];

        let drinkRepo = getRepository(Drink);
        for (let i = 0; i < drinkNames.length; i++) {
            let drink = new Drink(drinkNames[i], drinkDes[i], '', ProductType.product,
                drinkProfiles[i], [{type: CategoryType.Drink, description: ''}], true);
            await drinkRepo.save(drink);
        }

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
