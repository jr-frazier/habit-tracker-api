import { Router } from "express";
import {z} from "zod";
import {validateBody, validateParams} from "../middleware/validation.ts";
import {authenticatedToken} from "../middleware/auth.ts";
import {createHabit, getHabit, getHabits, updateHabit} from "../controllers/habitController.ts";
import {createHabitSchema, updateHabitSchema} from "../db/schema.ts";



const completeParamsSchema = z.object({
    id: z.string()
})

const router = Router();

// Apply the authentication middleware to all routes in this router
router.use(authenticatedToken)

router.get('/', getHabits)

router.get('/:id', getHabit)

// POST: Create New Habit
router.post('/', validateBody(createHabitSchema) ,(createHabit))

router.put('/:id',validateBody(updateHabitSchema), updateHabit)

router.delete('/:id', (req, res) => {
    res.status(200).json({ message: 'Habit deleted successfully' });
})

router.post('/:id/complete', validateParams(completeParamsSchema), validateBody(createHabitSchema), (req, res) => {
    res.status(200).json({ message: 'Habit completed successfully' });
})


export default router;