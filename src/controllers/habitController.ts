import type { Response } from 'express';
import type { AuthenticatedRequest } from "../middleware/auth.ts";
import  { db } from '../db/connection.ts'
import { habits, entries, habitTags, tags } from '../db/schema.ts';
import {desc, eq, and} from "drizzle-orm";
import {z} from 'zod'

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {

    try {
        const {name, description, frequency, targetCount, tagIds} = req.body;


        const result = await db.transaction(async (tx) => {
            const [newHabit] = await tx.insert(habits).values({
                userId: req.user.id,
                name,
                description,
                frequency,
                targetCount,
            }).returning();

            if (tagIds && tagIds.length > 0) {
                const habitTagValues = tagIds.map((tagId: number) => ({
                    habitId: newHabit.id,
                    tagId,
                }))

                await tx.insert(habitTags).values(habitTagValues);
            }

            return newHabit;
        })

        res.status(201).json({
            message: 'Habit created successfully',
            habit: result
        })
    } catch (error) {
        console.error('Error creating habit:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const getHabits = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userHabitsWithTags = await db.query.habits.findMany({
            where: eq(habits.userId, req.user.id),
            with: {
                habitTags: {
                    with: {
                        tag: true
                    }
                }
            },
            orderBy: [desc(habits.createdAt)]
        })

        const habitsWithTags = userHabitsWithTags.map((habit) => ({
                ...habit,
                tags: habit.habitTags.map((tag) => tag.tag),
                habitTags: undefined
        }))

        res.json({
            habits: habitsWithTags,
        })
    } catch (error) {
        console.error('Error fetching habits:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const getHabit = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const habit = await db.query.habits.findFirst({
            where: and(
                eq(habits.id, req.params.id),
                eq(habits.userId, req.user.id)
            ),
            with: {
                habitTags: {
                    with: {
                        tag: true
                    }
                }
            }
        });

        if (!habit) {
            return res.status(404).json({error: 'Habit not found'});
        }

        const habitWithTags = {
            ...habit,
            tags: habit.habitTags.map((ht) => ht.tag),
            habitTags: undefined
        };

        res.json({habit: habitWithTags});
    } catch (error) {
        console.error('Error fetching habit:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = req.params.id;
        const {tagIds, ...updates} = req.body;

        const result = await db.transaction(async (tx) => {
            const [updateHabit] = await tx
                .update(habits)
                .set({...updates, updatedAt: new Date()})
                .where(and(eq(habits.id, id), eq(habits.userId, req.user.id)))
                .returning();

            if(!updateHabit) {
               res.status(401).end()
            }

           if(tagIds !== undefined) {

               await tx.delete(habitTags).where(eq(habitTags.habitId, id));

               if(tagIds.length > 0) {
                   const habitTagValues = tagIds.map((tagId: number) => ({
                       habitId: id,
                       tagId,
                   }))
                   await tx.insert(habitTags).values(habitTagValues);
               }
           }

            return updateHabit;
        })
        res.json({message: 'Habit updated successfully', habit: result})
    } catch (error) {
        console.error('Error updating habit:', error);
        res.status(500).json({error: 'Failed to update habit'});
    }
}

