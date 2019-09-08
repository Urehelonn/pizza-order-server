import {Router} from "express";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";
import {DrinkController} from "../controller/DrinkController";

const regxCategoryId = '[a-z0-9]+';
const router = Router();

router.get('/', DrinkController.getDrinks);
router.get('/:id', DrinkController.getDrinkById);
router.post('/', [checkJwt, checkRole(['admin'])],
    DrinkController.newDrink);
router.get('/checkDuplicate/:name', DrinkController.checkDrinkExisted);
router.patch(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], DrinkController.editDrink);
router.delete(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], DrinkController.deleteDrink);

export default router;