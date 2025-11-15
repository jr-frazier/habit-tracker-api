import type {Request, Response} from 'express';
import {db} from '../db/connection.ts'
import type {NewUser} from '../db/schema.ts'
import {users} from '../db/schema.ts'
import {generateToken} from "../utils/jwt.ts";
import {comparePasswords, hashPassword} from "../utils/passwords.ts";
import {eq} from 'drizzle-orm';

export const register = async (req: Request<any, any, NewUser>, res: Response) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);

        const [user] = await db.insert(users).values({
            ...req.body,
            password: hashedPassword
        })
            .returning({
                id: users.id,
                email: users.email,
                username: users.username,
                firstName: users.firstName,
                lastName: users.lastName,
                createdAt: users.createdAt
            })

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username,
        });

        return res.status(201).json({message: 'User Created', user, token});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {email, body, password} = req.body;
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'})
        }

        if (user) {
            const isPasswordValid = await comparePasswords(password, user.password)
            if (!isPasswordValid) {
                return res.status(401).json({message: 'Invalid password'})
            }
        }

        const token = await generateToken({
            id: user.id,
            email: user.email,
            username: user.username,
        });

        return res.status(200).json({
            message: 'Login successful', user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt
            }, token
        });
    } catch (error) {
        console.error('Login error:', error);
    }
}