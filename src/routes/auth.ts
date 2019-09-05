import {Router} from "express";

const router = Router();

//login
router.use('/login', AuthController.login);


//login
router.use('/change-password', AuthController.changePassword);

export default authRouter;