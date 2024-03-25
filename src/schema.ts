import {
	pgTable,
	integer,
	text,
	timestamp,
	serial,
	boolean,
	primaryKey,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	githubId: integer('github_id').unique(),
	username: text('user'),
})
export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
})
export const courses = pgTable('courses', {
	id: serial('id').notNull().primaryKey(),
	name: text('name').notNull(),
})
export const classes = pgTable('classes', {
	id: serial('id').notNull().primaryKey(),
	classNumber: text('class_number').notNull(),
	courseId: integer('course_id')
		.notNull()
		.references(() => courses.id),
	// TODO: add more meta data like name, description
})
export const resources = pgTable('resources', {
	id: serial('id').notNull().primaryKey(),
	link: text('link').notNull().unique(),
	name: text('name'),
	format: text('format'),
})
export const courseResources = pgTable('course_resources', {
	id: serial('id').notNull().primaryKey(),
	courseId: integer('course_id')
		.notNull()
		.references(() => courses.id),
	resourceId: integer('resource_id')
		.notNull()
		.references(() => resources.id),
})
export const votes = pgTable('votes', {
	// id: serial('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	courseResourcesId: integer('course_resource_id')
		.notNull()
		.references(() => courseResources.id),
	classId: integer('class_id')
		.notNull()
		.references(() => classes.id),
	isLiked: boolean('is_liked').notNull(),
}, (table) => {
	return {
		pk: primaryKey({
			name: 'vote_id',
			columns: [
				table.userId,
				table.classId,
				table.courseResourcesId
			]
		})
	}
})
