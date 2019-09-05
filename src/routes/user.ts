import {Router} from "express";
import {UserController} from "../controller/UserController";

const router = Router();
const regxUserID = '[a-z0-9]+';

// GET: localhost:3000/users
// Get all users
router.get('/', UserController.getUsers);


// GET: localhost:3000/users/:uid
// Get user by id
router.get(`/:uid(${regxUserID})`, UserController.getUserById);


// POST: localhost:3000/users
// Create user
router.post('/', UserController.newUser);


// PATCH: localhost:3000/users/:uid
// Update user by id
router.patch(`/:uid(${regxUserID})`, UserController.editUser);


// DELETE: localhost:3000/users/:uid
// Update user by id
router.delete(`/:uid(${regxUserID})`, UserController.deleteUser);


export default router;