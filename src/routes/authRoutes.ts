import { Router } from "express";
import {login, register} from "../controllers/authController.ts";
import { insertUserSchema } from "../db/schema.ts";
import {validateBody} from '../middleware/validation.ts'
import {z} from "zod";

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long")
}).strict()

const router = Router();

router.post('/register', validateBody(insertUserSchema) ,register)

router.post('/login', validateBody(loginSchema), login)

export default router;