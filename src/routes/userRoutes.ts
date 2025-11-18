import { Router } from "express";
import {authenticatedToken} from "../middleware/auth.ts";

const router = Router();

router.use(authenticatedToken)

router.get('/', (req, res) => {
    res.status(200).json({ message: 'User retrieved successfully' });
})

router.get('/:id', (req, res) => {
    res.status(200).json({ message: 'User retrieved successfully' });
})

router.post('/', (req, res) => {
    res.status(201).json({ message: 'User created successfully' });
})

router.put('/:id', (req, res) => {
    res.status(200).json({ message: 'User updated successfully' });
})

router.delete('/:id', (req, res) => {
    res.status(200).json({ message: 'User deleted successfully' });
})

export default router;