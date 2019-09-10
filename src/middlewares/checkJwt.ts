import {Request, Response, NextFunction} from "express";
import config from "../config/config";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization'];
    let jwtPayload = null;

    // console.log(token);

    //validate token first
    try{
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (e) {
        return res.status(401).send('error happens during jwt verify.');
    }

    // refresh token
    const {userId, username, role} = jwtPayload;
    const newToken = jwt.sign({userId, username, role},
        config.jwtSecret,
        {'expiresIn': '1h'}
    );
    res.setHeader('token', newToken);
    next();
};