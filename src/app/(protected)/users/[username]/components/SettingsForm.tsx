import { db } from '@/db'
import { classes, courses, users } from '@/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
// import { redirect } from 'next/navigation'

export default async function SettingsForm({
	username,
	currentCourse,
	currentClass,
}: {
	username: string | null
	currentCourse?: string | null
	currentClass?: string | null
}) {
	async function updateUserInfo(formData: FormData) {
		'use server'

		const currentCourse = formData.get('currentCourse') as string
		const currentClass = formData.get('currentClass') as string

		try {
			let chosenCourse = await db.query.courses.findFirst({
				where: (course) => eq(course.name, currentCourse),
			})
			if (!chosenCourse) {
				[chosenCourse] = await db
					.insert(courses)
					.values({ name: currentCourse })
					.returning()
			}

			let chosenClass = await db.query.classes.findFirst({
				where: (c, { and }) =>
					and(eq(c.classNumber, currentClass), eq(c.courseId, chosenCourse.id)),
			})
			if (!chosenClass) {				
				[chosenClass] = await db
					.insert(classes)
					.values({ 
						classNumber: currentClass, 
						courseId: chosenCourse.id })
					.returning()
			}
			await db
				.update(users)
				.set({
					currentClassId: chosenClass.id,
					currentCourseId: chosenCourse.id,
				}) 
				.where(eq(users.username, username!))
		} catch (err) {
			// TODO: handle error, toast?
			console.log(`🎈 err:`, err)
		} finally {
			redirect(`/course/${currentCourse.replaceAll(" ", "-")}`)
		}
	}
	return (
		<>
			<h2>{username}</h2>
			<form action={updateUserInfo}>
				{/*  get course list through query; store id in data-attribute?  */}
				<label htmlFor="currentCourse">Current Course: </label>
				<input
					type="text"
					id="currentCourse"
					name="currentCourse"
					defaultValue={currentCourse || ''}
				/>
				{/* TODO: text field is a search box, then send a query with search terms to db and provide suggestions or option to create a new course */}
				<label htmlFor="currentClass">Current Class: </label>
				<input
					type="number"
					id="currentClass"
					name="currentClass"
					defaultValue={currentClass || '1'}
				/>
				<button>CLICK</button>
			</form>
		</>
	)
}
