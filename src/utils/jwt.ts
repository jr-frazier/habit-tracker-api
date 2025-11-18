import {jwtVerify, SignJWT} from 'jose'
import {createSecretKey} from "crypto";
import env from '../../env.ts'
import {z} from 'zod'

// define the shape of the payload so that we can use zod to validate it later on
const jwtPayloadSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.email(),
})

// type the payload to make it easier to use
export type JwtPayload = z.infer<typeof jwtPayloadSchema>

export const generateToken = (payload: JwtPayload) => {
    const secret = env.JWT_SECRET
    const secretKey = createSecretKey(secret, 'utf-8')

    // @ts-ignore
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
        .sign(secretKey)
}


export const verifyToken = async (token: string):Promise<JwtPayload> => {
    const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
    const {payload} = await jwtVerify(token, secretKey)

    // verify that the payload is valid
    return jwtPayloadSchema.parse(payload)
}