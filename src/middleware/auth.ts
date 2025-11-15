import type {NextFunction, Request, Response} from 'express'
import {type JwtPayload, verifyToken} from "../utils/jwt.ts";


export interface AuthenticatedRequest extends Request {
    user?: JwtPayload
}

export const authenticatedToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   try {
       const authHeader = req.headers['authorization'];
       const token = authHeader && authHeader.split(' ')[1]

       if (!token) {
           return res.status(401).json({error: 'Bad Request'})
       }

       req.user = await verifyToken(token)
       next()
   } catch (error) {
       return res.status(403).json({error: 'Forbidden'})
   }
}