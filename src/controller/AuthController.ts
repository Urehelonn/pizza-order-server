import {getRepository} from "typeorm";
import {User} from "../entity/User";
import {Request, Response} from "express";
import config from "../config/config";
import * as jwt from "jsonwebtoken";

class AuthController {
    private static get repo() {
        return getRepository(User);
    }

    static login = async (req: Request, res: Response) => {

        let {username, password} = req.body;
        if (!(username && password)) {
            res.status(400).send({msg: 'no required params found.'});
        }

        let user: User = null;
        try {
            user = await AuthController.repo.findOneOrFail({where: {username}})
        } catch (e) {
            return res.status(401).send({msg: 'cannot find the user.'})
        }

        if (!user.checkIfUnencryptedPasswordValid(password)) {
            return res.status(401).send({msg: 'Username and password not match.'});
        }

        // give jwt back to user, with expiration
        const token = jwt.sign({userId: user.id, username: username, role: user.role},
            config.jwtSecret,
            {'expiresIn': '1h'}
        );
        return res.send(token);
        // TODO: with SSO (single sign on)
    }

    static changePassword = async (req: Request, res: Response) => {
        
    }
}