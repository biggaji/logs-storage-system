import { Router } from "express";
import { createAdmin, login } from "../../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.post('/create', createAdmin);
authRouter.post('/login', login);

export default authRouter;