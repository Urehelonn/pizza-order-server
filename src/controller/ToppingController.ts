import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {validate} from "class-validator";
import {ERRCODE, ERRSTR, PizzaError} from "../helper/Error";
import {Topping} from "../entity/Topping";

export class ToppingController {

    private static get repo() {
        return getRepository(Topping);
    };

    static getToppings = async (req: Request, res: Response) => {
        const toppings = await ToppingController.repo.find();
        return res.send(toppings);
    };

    static checkToppingExisted = async (req: Request, res: Response) => {
        const name = req.params.name;
        const repo = ToppingController.repo;
        const numb = await repo.count({name});
        return res.send(new PizzaError(ERRCODE.E_OK,
            `Find ${numb} topping with name ${name}`, numb));
    }

    static getToppingById = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            const category = await ToppingController.repo.findOneOrFail(id);
            res.send(category);
        } catch (err) {
            console.log('exception caught.');
            return res.status(ERRCODE.E_NOTFOUND).send(
                new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }
    };

    static getToppingByName = async (req: Request, res: Response) => {
        const name: string = req.params.name;
        try {
            const topping = await ToppingController.repo.findOneOrFail(name);
            res.send(topping);
        } catch (err) {
            console.log('exception caught.');
            return res.status(ERRCODE.E_NOTFOUND).send(
                new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }
    };

    static newTopping = async (req: Request, res: Response) => {
        let {
            name, desc, img, type, profiles,
            category, inStock, deleted, currency, halal
        } = req.body;
        let topping = new Topping(name, desc, img, type, profiles,
            category, inStock, deleted, currency, halal);

        const err = await validate(topping);
        if (err.length > 0) {
            return res.status(ERRCODE.E_BADREQUEST)
                .send(new PizzaError(ERRCODE.E_BADREQUEST, `Topping save failed.`));
        }
        await ToppingController.repo.save(topping);

        return res.status(ERRCODE.E_CREATED).send(
            new PizzaError(ERRCODE.E_CREATED, ERRSTR.S_CREATED, topping));
    };

    static editTopping = async (req: Request, res: Response) => {
        const id = req.params.id;
        let oldTopping: Topping = null;

        try {
            oldTopping = await ToppingController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        let {
            name, desc, img, type, profiles,
            category, inStock, deleted, currency, halal
        } = req.body;
        let topping = new Topping(name, desc,
            img, type, profiles, category, inStock,
            deleted, currency, halal);
        topping.id = oldTopping.id;

        const err = await validate(topping);
        if (err.length > 0) {
            return res.status(ERRCODE.E_BADREQUEST)
                .send(new PizzaError(ERRCODE.E_BADREQUEST, `Topping save failed.`));
        }
        await ToppingController.repo.save(topping);
        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, ERRSTR.S_UPDATED, topping));
    };

    static deleteTopping = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            await ToppingController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        await ToppingController.repo.delete(id);

        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, `Topping with id ${id} has been deleted.`));
    };
}