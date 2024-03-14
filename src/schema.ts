import { pgTable, integer, text, timestamp, PgColumnBuilder } from 'drizzle-orm/pg-core'

export const users = pgTable('users',  {
	id: text('id').primaryKey(),
	githubId: integer('github_id').unique(),
	username: text('user'),
})

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(), // for db purposes; have the sessionId be a non-guessable/uuid
	// sessionId: integer('session_id'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(), // why is this here?
})
