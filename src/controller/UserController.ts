import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from "class-validator";
import {ERRCODE, ERRSTR, PizzaError} from "../helper/Error";

const columnFilter: any = {
    select: ['id', 'username', 'role']
};

export class UserController {

    private static get repo() {
        return getRepository(User);
    };

    static getUsers = async (req: Request, res: Response) => {
        // get all users from db
        const users = await UserController.repo.find(columnFilter);

        return res.send(new PizzaError(ERRCODE.E_OK, ERRSTR.S_OK, users));
    };

    static getUserById = async (req: Request, res: Response) => {
        const id: string = req.params.uid;

        try {
            const user = await UserController.repo.findOneOrFail(id, columnFilter);
            res.send(user);
        } catch (err) {
            console.log('exception caught.');
            return res.status(ERRCODE.E_NOTFOUND).send(
                new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }
    };

    static newUser = async (req: Request, res: Response) => {
        let {username, password, role} = req.body;
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;

        const err = await validate(user);
        if (err.length > 0) {
            return res.status(ERRCODE.E_BADREQUEST)
                .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
        }

        user.hashPassword();
        try {
            await UserController.repo.save(user);
        } catch (e) {
            console.log('save user error:', e);
            return res.status(ERRCODE.E_BADREQUEST)
                .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
        }

        return res.status(ERRCODE.E_CREATED).send(
            new PizzaError(ERRCODE.E_CREATED, ERRSTR.S_CREATED, user));
    };

    static editUser = async (req: Request, res: Response) => {
        const id: string = req.params.uid;
        let {username, role} = req.body;
        let user: User = null;
        try {
            user = await UserController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        user.username = username;
        user.role = role;
        const err = await validate(user);
        if (err.length > 0) {
            return res.status(ERRCODE.E_BADREQUEST)
                .send(new PizzaError(ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
        }

        try {
            await UserController.repo.save(user);
        } catch (e) {
            console.log('save user error:', e);
            return res.status(ERRCODE.E_DUPLICATE)
                .send(new PizzaError(ERRCODE.E_DUPLICATE, ERRSTR.S_DUPLICATE));
        }

        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, ERRSTR.S_UPDATED));
    };

    static deleteUser = async (req: Request, res: Response) => {
        const id: string = req.params.uid;
        try {
            await UserController.repo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND)
                .send(new PizzaError(ERRCODE.E_NOTFOUND, ERRSTR.S_NOTFOUND));
        }

        await UserController.repo.delete(id);

        return res.status(ERRCODE.E_UPDATED)
            .send(new PizzaError(ERRCODE.E_UPDATED, `User with id ${id} deleted.`));
    };

    static checkUsernameDuplicated = async (req: Request, res: Response) => {
        const username: string = req.params.username;
        try {
            const counter = await UserController.repo.count({username: username});
            return res.status(ERRCODE.E_OK,).send(new PizzaError(
                ERRCODE.E_OK,
                ERRSTR.S_OK,
                counter
            ));
        } catch (err) {
            console.log(err);
            return res.status(ERRCODE.E_DBERROR).send(
                new PizzaError(ERRCODE.E_DBERROR, ERRSTR.S_DBERR));
        }
    }
}