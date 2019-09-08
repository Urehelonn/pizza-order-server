import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {validate} from "class-validator";
import {ERRCODE, ERRSTR, PizzaError} from "../helper/Error";
import {Order} from "../entity/Order";

export class OrderController {

    private static get repo() {
        return getRepository(Order);
    };

    static getOrders = async (req: Request, res: Response) => {
        const orders = await OrderController.repo.find();
        return res.send(new PizzaError(ERRCODE.E_OK, ERRSTR.S_OK, orders));
    };

    static checkOrderExisted = async (req: Request, res: Response) => {
        const id = req.params.id;
        const repo = OrderController.repo;
        const numb = await repo.count({id});
        return res.send(new PizzaError(ERRCODE.E_OK,
            `Find ${numb} order with id ${id}`, numb));
    }

    static getOrderById = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            const order = await OrderController.repo.findOneOrFail(id);
            res.send(new PizzaError(ERRCODE.E_OK, '', order));
        } catch (err) {
            console.log('exception caught.');
            return res.status(ERRCODE.E_NOTFOUND).send(
                new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }
    };

    static newOrder = async (req: Request, res: Response) => {
        let {
            products, deleted, status, note, paymentId
        } = req.body;
        let order = new Order(products, deleted, status, note, paymentId);

        const err = await validate(order);
        if (err.length > 0) {
            return res.status(ERRCODE.E_BADREQUEST)
                .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
        }
        await OrderController.repo.save(order);

        return res.status(ERRCODE.E_CREATED).send(
            new PizzaError(ERRCODE.E_CREATED, ERRSTR.S_CREATED, order));
    };

    static editOrder = async (req: Request, res: Response) => {
        const id = req.params.id;
        let oldOrder: Order = null;

        try {
            oldOrder = await OrderController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        let {
            products, deleted, status, note, paymentId
        } = req.body;
        let order = new Order(products, deleted, status, note, paymentId);
        order.id = oldOrder.id;

        const err = await validate(order);
        if (err.length > 0) {
            return res.status(ERRCODE.E_BADREQUEST)
                .send(new PizzaError(ERRCODE.E_BADREQUEST, `Order save failed.`));
        }
        await OrderController.repo.save(order);
        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, ERRSTR.S_UPDATED, order));
    };

    static deleteOrder = async (req: Request, res: Response) => {
        const id: string = req.params.id;
        try {
            await OrderController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        await OrderController.repo.delete(id);

        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, `Order with id ${id} has been deleted.`));
    };
}