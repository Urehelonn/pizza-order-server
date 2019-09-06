import {Router} from "express";
import {UserController} from "../controller/UserController";
import {checkJwt} from "../middlewares/checkJwt";
import {checkRole} from "../middlewares/checkRole";

const router = Router();
const regxUserID = '[a-z0-9]+';

// GET: localhost:3838/users
// Get all users
router.get('/', [checkJwt, checkRole(['admin'])], UserController.getUsers);


// GET: localhost:3838/users/:uid
// Get user by id
router.get(`/:uid(${regxUserID})`, [checkJwt, checkRole(['admin'])], UserController.getUserById);


// POST: localhost:3838/users
// Create user
router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);


// PATCH: localhost:3838/users/:uid
// Update user by id
router.patch(`/:uid(${regxUserID})`, [checkJwt, checkRole(['admin'])], UserController.editUser);


// DELETE: localhost:3838/users/:uid
// Update user by id
router.delete(`/:uid(${regxUserID})`, [checkJwt, checkRole(['admin'])], UserController.deleteUser);


export default router;