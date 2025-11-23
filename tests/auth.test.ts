import request from 'supertest'
import app from '../src/server.ts'
import {createTestUser, cleanupDatabase} from './setup/dbHelpers.ts'


describe("Authentication Endponits", () => {
    afterEach(async () => {
        await cleanupDatabase()
    })

    describe('POST /api/auth/register', () => {
        it('should register a new user with valid data', async () => {
            const userData = {
                username: 'testuser',
                email: 'testuser@gmail.com',
                password: 'password123'
            }
            const response = await request(app)
                .post('/api/auth/register')
                .send(userData)
                .expect(201)

            expect(response.body).toHaveProperty('user')
            expect(response.body).toHaveProperty('token')
            expect(response.body.user).not.toHaveProperty('password')
        })
    })
})

describe("POST /api/auth/login",() => {
    it('should login a user with valid credentials', async () => {
        const {user} = await createTestUser()
        const response = await request(app)
            .post('/api/auth/login')
            .send({email: user.email, password: 'adminpassword1234'})
            .expect(200)

        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body).toHaveProperty('token')
    })
})