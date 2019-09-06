import {Router} from "express";
import {AuthController} from "../controller/AuthController";

const authRouter = Router();

//login
authRouter.use('/login', AuthController.login);

//change password
authRouter.use('/change-password', AuthController.changePassword);

export default authRouter;