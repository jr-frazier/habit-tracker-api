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

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Get all habits for the authenticated user
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of habits
 *       401:
 *         description: Unauthorized
 */
router.get('/', getHabits)

/**
 * @swagger
 * /api/habits/{id}:
 *   get:
 *     summary: Get a specific habit by ID
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Habit not found
 */
router.get('/:id', getHabit)

/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - frequency
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *               frequency:
 *                 type: string
 *               targetCount:
 *                 type: integer
 *                 default: 1
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Habit created successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 */
router.post('/', validateBody(createHabitSchema) ,(createHabit))

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Update an existing habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               frequency:
 *                 type: string
 *               targetCount:
 *                 type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Habit not found
 */
router.put('/:id',validateBody(updateHabitSchema), updateHabit)

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Delete a habit
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Habit not found
 */
router.delete('/:id', (req, res) => {
    res.status(200).json({ message: 'Habit deleted successfully' });
})

/**
 * @swagger
 * /api/habits/{id}/complete:
 *   post:
 *     summary: Mark a habit as completed
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit completed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Habit not found
 */
router.post('/:id/complete', validateParams(completeParamsSchema), validateBody(createHabitSchema), (req, res) => {
    res.status(200).json({ message: 'Habit completed successfully' });
})


export default router;