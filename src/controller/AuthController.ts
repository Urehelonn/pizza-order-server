import {getRepository} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import {ERRCODE, ERRSTR, PizzaError} from "../helper/Error";
import {validate} from "class-validator";

export class AuthController {
    private static get repo() {
        return getRepository(User);
    }

    static login = async (req: Request, res: Response) => {
        let {username, password} = req.body;
        if (!(username && password)) {
            res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(ERRCODE.E_BADREQUEST,
                ERRSTR.S_BADREQUEST));
        }

        let user: User = null;
        try {
            user = await AuthController.repo.findOneOrFail({where: {username}})
        } catch (e) {
            return res.status(ERRCODE.E_NOTFOUND).send(new PizzaError(ERRCODE.E_NOTFOUND,
                ERRSTR.S_NOTFOUND))
        }

        if (!user.checkIfUnencryptedPasswordValid(password)) {
            return res.status(ERRCODE.E_UNAUTHORIZED).send(new PizzaError(ERRCODE.E_UNAUTHORIZED,
                ERRSTR.S_WRONGPASSWORD));
        }

        // give jwt back to user, with expiration
        const token = jwt.sign({userId: user.id, username: username, role: user.role},
            config.jwtSecret,
            {'expiresIn': '1h'}
        );
        return res.status(ERRCODE.E_OK).send(new PizzaError(ERRCODE.E_OK,
            ERRSTR.S_OK, {token, user}));
    }

    static changePassword = async (req: Request, res: Response) => {
        // get id from jwt
        const id = res.locals.jwtPayload.userId;
        const {oldPassword, newPassword} = req.body;
        if (!(oldPassword && newPassword)) {
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST));
        }

        // get user from the database
        const userRepo = getRepository(User);
        let user: User = null;
        try {
            user = await userRepo.findOneOrFail(id);
        } catch (e) {
            return res.status(ERRCODE.E_UNAUTHORIZED)
                .send(new PizzaError(ERRCODE.E_UNAUTHORIZED,
                    `User with id ${id} ${ERRSTR.S_NOTFOUND}`));
        }

        if (!user.checkIfUnencryptedPasswordValid(oldPassword)) {
            return res.status(ERRCODE.E_UNAUTHORIZED).send(
                new PizzaError(ERRCODE.E_UNAUTHORIZED,
                    ERRSTR.S_WRONGPASSWORD));
        }

        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            return res.status(ERRCODE.E_BADREQUEST).send(new PizzaError(
                ERRCODE.E_BADREQUEST, ERRSTR.S_BADREQUEST
            ))
        }
        user.hashPassword();
        await userRepo.save(user);
        return res.status(ERRCODE.E_UPDATED).send(new PizzaError(
            ERRCODE.E_UPDATED, ERRSTR.S_UPDATED));
    }
}