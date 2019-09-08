import {Router} from "express";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";
import {PizzaController} from "../controller/PizzaController";

const regxCategoryId = '[a-z0-9]+';
const router = Router();

router.get('/', PizzaController.getPizzas);
router.get('/:id', PizzaController.getPizzaById);
router.post('/', [checkJwt, checkRole(['admin'])],
    PizzaController.newPizza);
router.get('/checkDuplicate/:name', PizzaController.checkPizzaExisted);
router.patch(`/:id(${regxCategoryId})`,
    [checkJwt], PizzaController.editPizza);
router.delete(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], PizzaController.deletePizza);

export default router;