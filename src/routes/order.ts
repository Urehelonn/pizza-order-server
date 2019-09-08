import {Router} from "express";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";
import {OrderController} from "../controller/OrderController";

const regxCategoryId = '[a-z0-9]+';
const router = Router();

// TODO: strict user to view only their order not from the others
router.get('/',
    [checkJwt, checkRole(['admin'])], OrderController.getOrders);
router.get('/:id',
    [checkJwt], OrderController.getOrderById);
router.post('/', [checkJwt, checkRole(['admin'])],
    OrderController.newOrder);
router.get('/checkDuplicate/:name',
    [checkJwt], OrderController.checkOrderExisted);
router.patch(`/:id(${regxCategoryId})`,
    [checkJwt], OrderController.editOrder);
router.delete(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], OrderController.deleteOrder);

export default router;