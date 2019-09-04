import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {validate} from "class-validator";

const columnFilter: any = {
    select: ['id', 'username', 'role']
}

export class UserController {

    private static userRepo = getRepository(User);

    static listAll = async (req: Request, res: Response) => {
        // get all users from db
        const users = await UserController.userRepo.find(columnFilter);

        res.send(users);
    };

    static getOneById = async (req: Request, res: Response) => {
        const id: string = req.params.uid;

        try {
            const user = await UserController.userRepo.findOneOrFail(id, columnFilter);
            res.send(user);
        } catch (err) {
            console.log('exception caught.');
            return res.status(404).send('User not found');
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
            return res.status(400).send(err);
        }

        user.hashPassword();
        try {
            await UserController.userRepo.save(user);
        } catch (e) {
            console.log('save user error:', e);
            return res.status(400).send('Save created user error!');
        }

        return res.status(201).send('User created ' + username);
    };

    static editUser = async (req: Request, res: Response) => {
        const id: string = req.params.uid;
        let {username, role} = req.body;
        let user: User = null;
        try {
            user = await UserController.userRepo.findOneOrFail(id);
        } catch (e) {
            return res.status(404).send('User not found.');
        }

        user.username = username;
        user.role = role;
        const err = await validate(user);
        if (err.length > 0) {
            return res.status(400).send(err)
        }

        try {
            await UserController.userRepo.save(user);
        } catch (e) {
            console.log('save user error:', e);
            return res.status(409).send('Username already in used.');
        }

        return res.status(204).send('User updated ' + username);
    }

    static deleteUser = async (req: Request, res: Response) => {
        const id: string = req.params.uid;
        let user: User = null;
        try {
            user = await UserController.userRepo.findOneOrFail(id);
        } catch (e) {
            return res.status(404).send('User not found.');
        }

        await UserController.userRepo.delete(id);

        return res.status(204).send('User deleted.');
    }

}