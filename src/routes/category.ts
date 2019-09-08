import {Router} from "express";
import {CategoryController} from "../controller/CategoryController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const regxCategoryId = '[a-z0-9]+';
const router = Router();

router.get('/', CategoryController.getCaterogies);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', [checkJwt, checkRole(['admin'])],
    CategoryController.getCaterogies);
router.get('/checkDuplicate/:type', CategoryController.checkCategoryExisted);
router.patch(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], CategoryController.editCategory);
router.delete(`/:id(${regxCategoryId})`,
    [checkJwt, checkRole(['admin'])], CategoryController.deleteCategory);

export default router;