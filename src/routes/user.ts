import {Router} from "express";
import {UserController} from "../controller/UserController";

const router = Router();
const regxUserID = '[a-z0-9]';

// GET: localhost:3000/api/user
// Get all users
router.get('/', UserController.listAll);


// GET: localhost:3000/api/user/:uid
// Get user by id
router.get(`/:uid(${regxUserID})`, UserController.getOneById);


// POST: localhost:3000/api/user
// Create user
router.get('/', UserController.newUser);


// PATCH: localhost:3000/user/api/:uid
// Update user by id
router.get(`/:uid(${regxUserID})`, UserController.editUser);


// DELETE: localhost:3000/user/api/:uid
// Update user by id
router.get(`/:uid(${regxUserID})`, UserController.deleteUser);


export default router;