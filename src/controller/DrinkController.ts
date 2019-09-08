import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {validate} from "class-validator";
import {ERRCODE, ERRSTR, PizzaError} from "../helper/Error";
import {Drink} from "../entity/Drink";

const columnFilter: any = {
    select: ['name', 'desc', 'img', 'type', 'profiles',
        'category', 'inStock', 'deleted', 'currency', 'halal', 'id']
};

export class DrinkController {

    private static get repo() {
        return getRepository(Drink);
    };

    static getDrinks = async (req: Request, res: Response) => {
        const drinks = await DrinkController.repo.find(columnFilter);
        return res.send(new PizzaError(ERRCODE.E_OK, ERRSTR.S_OK, drinks));
    };

    static checkDrinkExisted = async (req: Request, res: Response) => {
        const name = req.params.name;
        const repo = DrinkController.repo;
        const numb = await repo.count({name});
        return res.send(new PizzaError(ERRCODE.E_OK,
            `Find ${numb} categories with name ${name}`, numb));
    }

    static getDrinkById = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            const category = await DrinkController.repo.findOneOrFail(id, columnFilter);
            res.send(category);
        } catch (err) {
            console.log('exception caught.');
            return res.status(ERRCODE.E_NOTFOUND).send(
                new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }
    };

    static newDrink = async (req: Request, res: Response) => {
        let {
            name, desc, img, type, profiles,
            category, inStock, deleted, currency, halal
        } = req.body;
        let drink = new Drink(name, desc,
            img, type, profiles, category, inStock,
            deleted, currency, halal);

        try {
            const err = await validate(drink);
            if (err.length > 0) {
                return res.status(ERRCODE.E_BADREQUEST)
                    .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
            }
            await DrinkController.repo.save(drink);
        } catch (e) {
            console.log('error: save drink', e);
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, `Drink save failed.`, drink
            ));
        }

        return res.status(ERRCODE.E_CREATED).send(
            new PizzaError(ERRCODE.E_CREATED, ERRSTR.S_CREATED, drink));
    };

    static editDrink = async (req: Request, res: Response) => {
        const id = req.params.id;
        let oldDrink: Drink = null;

        try {
            oldDrink = await DrinkController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        let {
            name, desc, img, type, profiles,
            category, inStock, deleted, currency, halal
        } = req.body;
        let drink = new Drink(name, desc,
            img, type, profiles, category, inStock,
            deleted, currency, halal);
        drink.id = oldDrink.id;

        try {
            const err = await validate(drink);
            if (err.length > 0) {
                return res.status(ERRCODE.E_BADREQUEST)
                    .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
            }
            await DrinkController.repo.save(drink);
        } catch (e) {
            console.log('save drink failed: ', e);
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, `Drink save failed.`, drink
            ));
        }
        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, ERRSTR.S_UPDATED, drink));
    };

    static deleteDrink = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            await DrinkController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        await DrinkController.repo.delete(id);

        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, `Drink with id ${id} has been deleted.`));
    };
}