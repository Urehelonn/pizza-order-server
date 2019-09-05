import {Router} from "express";
import userRouter from "./user";
import authRouter from "./auth";

const routes = Router();

routes.use('/users', userRouter);
routes.use('/', authRouter);


export default routes;