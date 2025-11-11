import { Router } from "express";
import {z} from "zod";
import {validateBody, validateParams} from "../middleware/validation.ts";

const createHabitSchema = z.object({
    name: z.string().min(1),
}).strict()

const completeParamsSchema = z.object({
    id: z.string()
})

const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Habits retrieved successfully' });
})

router.get('/:id', (req, res) => {
    res.status(200).json({ message: 'Habit retrieved successfully' });
})

router.post('/', validateBody(createHabitSchema) ,(req, res) => {
    res.status(201).json({ message: 'Habit created successfully' });
})

router.put('/:id', (req, res) => {
    res.status(200).json({ message: 'Habit updated successfully' });
})

router.delete('/:id', (req, res) => {
    res.status(200).json({ message: 'Habit deleted successfully' });
})

router.post('/:id/complete', validateParams(completeParamsSchema), validateBody(createHabitSchema), (req, res) => {
    res.status(200).json({ message: 'Habit completed successfully' });
})


export default router;