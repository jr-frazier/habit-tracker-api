import {db} from './connection.ts'
import {users, habits, entries, tags, habitTags } from './schema.ts'

const seed = async () => {
    console.log('🌱 Starting database seed...')

    try {
        console.log('💨 Clearing exsting data...')
        await db.delete(users).execute()
        await db.delete(habits).execute()
        await db.delete(entries).execute()
        await db.delete(tags).execute()
        await db.delete(habitTags).execute()

        console.log('creating demo users...')
        const [demoUser] = await db.insert(users).values( {
            email: 'demo@app.com',
            password: 'demo',
            firstName: 'Demo',
            lastName: 'User',
            username: 'demo',
        }).returning()

        console.log('creating demo tags...')
        const [healthTag] = await db.insert(tags).values({
            name: 'Health',
            color: '#f0f0f0'
        }).returning()

        console.log('creating demo habits...')

        const [exerciseHabit] = await db.insert(habits).values({
            userId: demoUser.id,
            name: 'Exercise',
            description: 'daily workout',
            frequency: 'daily',
            targetCount: 3,
            }
        ).returning()

        await db.insert(habitTags).values({
            habitId: exerciseHabit.id,
            tagId: healthTag.id,
        })

        console.log('Adding completion entries...')
        const today = new Date()
        today.setHours(12, 0, 0, 0)

        for (let i = 0; i < 7; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)

            await db.insert(entries).values({
                habitId: exerciseHabit.id,
                completionDate: date,
            })
        }

        console.log('✅ Database seeded successfully!')
        console.log('user credentials:')
        console.log(`email: ${demoUser.email}`)
        console.log(`username: ${demoUser.username}`)
        console.log(`password: ${demoUser.password}`)

    } catch (error) {
        console.error('❌ Error seeding database:', error)
        process.exit(1)
    }
}

// @ts-ignore
if (import.meta.url === `file://${process.argv[1]}`) {
    seed()
        .then(() => process.exit(0))
        .catch((e) => process.exit(1))
}

export default seed