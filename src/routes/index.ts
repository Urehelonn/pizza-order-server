import {Router} from "express";
import userRouter from "./user";
import authRouter from "./auth";
import category from "./category";
import topping from "./topping";
import pizza from "./pizza";
import drink from "./drink";
import order from "./order";

const routes = Router();

routes.use('/users', userRouter);
routes.use('/', authRouter);
routes.use('/category', category);
routes.use('/topping', topping);
routes.use('/pizza', pizza);
routes.use('/drink', drink);
routes.use('/order', order);


export default routes;