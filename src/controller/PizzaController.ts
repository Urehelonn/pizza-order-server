import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {validate} from "class-validator";
import {ERRCODE, ERRSTR, PizzaError} from "../helper/Error";
import {Pizza} from "../entity/Pizza";

const columnFilter: any = {
    select: ['toppings', 'name', 'desc', 'img', 'type', 'profiles',
        'category', 'inStock', 'deleted', 'currency', 'halal', 'id']
};

export class PizzaController {

    private static get repo() {
        return getRepository(Pizza);
    };

    static getPizzas = async (req: Request, res: Response) => {
        // get all users from db
        const users = await PizzaController.repo.find(columnFilter);

        return res.send(new PizzaError(ERRCODE.E_OK, ERRSTR.S_OK, users));
    };

    static checkPizzaExisted = async (req: Request, res: Response) => {
        const name = req.params.name;
        const repo = PizzaController.repo;
        const numb = await repo.count({name});
        return res.send(new PizzaError(ERRCODE.E_OK,
            `Find ${numb} pizza with name ${name}`, numb));
    }

    static getPizzaById = async (req: Request, res: Response) => {
        const id: string = req.params.id;

        try {
            const pizza = await PizzaController.repo.findOneOrFail(id, columnFilter);
            res.send(pizza);
        } catch (err) {
            console.log('exception caught.');
            return res.status(ERRCODE.E_NOTFOUND).send(
                new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }
    };

    static newPizza = async (req: Request, res: Response) => {
        let {
            toppings, name, desc, img, type, profiles,
            category, inStock, deleted, currency, halal
        } = req.body;
        let pizza = new Pizza(name, toppings, desc,
            img, type, profiles, category, inStock,
            deleted, currency, halal);

        try {
            const err = await validate(pizza);
            if (err.length > 0) {
                return res.status(ERRCODE.E_BADREQUEST)
                    .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
            }
            await PizzaController.repo.save(pizza);
        } catch (e) {
            console.log('error: save pizza', e);
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, `Pizza save failed.`, pizza
            ));
        }

        return res.status(ERRCODE.E_CREATED).send(
            new PizzaError(ERRCODE.E_CREATED, ERRSTR.S_CREATED, pizza));
    };

    static editPizza = async (req: Request, res: Response) => {
        const id = req.params.id;
        let oldPizza: Pizza = null;

        try {
            oldPizza = await PizzaController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        let {
            toppings, name, desc, img, type, profiles,
            category, inStock, deleted, currency, halal
        } = req.body;
        let pizza = new Pizza(name, toppings, desc,
            img, type, profiles, category, inStock,
            deleted, currency, halal);
        pizza.id = oldPizza.id;

        try {
            const err = await validate(pizza);
            if (err.length > 0) {
                return res.status(ERRCODE.E_BADREQUEST)
                    .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
            }
            await PizzaController.repo.save(pizza);
        } catch (e) {
            console.log('save pizza failed: ', e);
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, `Pizza save failed.`, pizza
            ));
        }
        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, ERRSTR.S_UPDATED, pizza));
    };

    static deletePizza = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            await PizzaController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        await PizzaController.repo.delete(id);

        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, `Pizza with id ${id} deleted.`));
    };
}