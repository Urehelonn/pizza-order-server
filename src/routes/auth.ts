import {Router} from "express";
import {AuthController} from "../controller/AuthController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const authRouter = Router();

//login
authRouter.use('/login', AuthController.login);

// check if token expired
authRouter.get('/check', [checkJwt], AuthController.checkToken);

//change password
authRouter.use('/change-password', AuthController.changePassword);

export default authRouter;