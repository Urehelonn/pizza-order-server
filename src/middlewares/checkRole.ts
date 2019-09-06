import {Request, Response, NextFunction} from "express";
import config from "../config/config";
import * as jwt from "jsonwebtoken";
import {getRepository} from "typeorm";
import {User} from "../entity/User";

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        let id = res.locals.jwtPayload.userId;
        let user: User = null;

        try {
            user = await getRepository(User).findOneOrFail(id);
        } catch (e) {
            return res.status(401).send('check roles failure.');
        }

        // check if the input roles includes the user's role
        if(user.role.some(r => roles.indexOf(r.toLowerCase())>-1)){
            next();
        }
        else{
            res.status(401).send('Current user has no permission.');
        }
    };
}