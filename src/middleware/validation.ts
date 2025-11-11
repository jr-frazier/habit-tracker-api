import type {NextFunction, Request, Response} from 'express';
import {ZodError, ZodType} from "zod";

export const validateBody = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body)
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                   error: "body validation failed",
                   details: error.issues.map(issue => ({
                       field: issue.path.join('.'),
                       message: issue.message,
                   })),
                })
            }
            next(error)
        }
    }
}

export const validateParams = (schema: ZodType) => {
   return (req: Request, res: Response, next: NextFunction) => {
       try {
           req.body = schema.parse(req.params)
           next()
       } catch (error) {
           if (error instanceof ZodError) {
               return res.status(400).json({
                   error: "param validation failed",
                   details: error.issues.map(issue => ({
                       field: issue.path.join('.'),
                       message: issue.message,
                   })),
                })
           }
           next(error)
       }
   }
}

export const validateQuery = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.query)
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: "query validation failed",
                    details: error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message,
                    }))
                })
            }
            next(error)
        }
    }
}