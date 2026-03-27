import express from 'express';
import { signup } from '../controller/auth.controllers.js';
import { login } from '../controller/auth.controllers.js';
import { logout } from '../controller/auth.controllers.js';

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

export default authRouter;