import { Lucia } from 'lucia'
import { GitHub } from 'arctic'

import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'

import pg from 'pg'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/node-postgres'

import { cookies } from 'next/headers'
import { cache } from 'react'

import type { Session, User } from 'lucia'
import { db, users, sessions } from './db'

export const github = new GitHub(
	process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
	process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!
)

// const pool = new pg.Pool()
// const db = drizzle(pool)

// const userTable = pgTable('user', {
// 	id: text('id').primaryKey(),
// })

// const sessionTable = pgTable('session', {
// 	id: text('id').primaryKey(),
// 	userId: text('user_id')
// 		.notNull()
// 		.references(() => userTable.id),
// 	expiresAt: timestamp('expires_at', {
// 		withTimezone: true,
// 		mode: 'date',
// 	}).notNull(),
// })

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		// this sets cookies with super long expiration
		// since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
		expires: false,
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production',
		},
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.github_id,
			username: attributes.username,
		}
	},
})

export const validateRequest = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
		if (!sessionId) {
			return {
				user: null,
				session: null,
			}
		}

		const result = await lucia.validateSession(sessionId)
		// next.js throws when you attempt to set cookie when rendering page
		try {
			if (result.session && result.session.fresh) {
				const sessionCookie = lucia.createSessionCookie(result.session.id)
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}
			if (!result.session) {
				const sessionCookie = lucia.createBlankSessionCookie()
				cookies().set(
					sessionCookie.name,
					sessionCookie.value,
					sessionCookie.attributes
				)
			}
		} catch {}
		return result
	}
)

// IMPORTANT!
declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: DatabaseUserAttributes
	}
}

interface DatabaseUserAttributes {
	github_id: number
	username: string
}
