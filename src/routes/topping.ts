import {Router} from "express";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";
import {ToppingController} from "../controller/ToppingController";

const regxCategoryId = '[a-z0-9]+';
const router = Router();

router.get('/', ToppingController.getToppings);
router.get('/:id', ToppingController.getToppingById);
router.get('/:name', ToppingController.getToppingByName);
router.post('/', [checkJwt, checkRole(['admin'])],
    ToppingController.newTopping);
router.get('/checkDuplicate/:type', ToppingController.checkToppingExisted);
router.patch(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], ToppingController.editTopping);
router.delete(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], ToppingController.deleteTopping);

export default router;