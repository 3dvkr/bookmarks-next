import { drizzle } from 'drizzle-orm/postgres-js'
// import { drizzle } from 'drizzle-orm/node-postgres'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL || ''
// const connectionString = process.env.NEXT_PUBLIC_DATABASE_URL!
console.log(`🎈 connectionString:`, connectionString)
// if transaction mode
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
export { users, sessions } from './schema'
