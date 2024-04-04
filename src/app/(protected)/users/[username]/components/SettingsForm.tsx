import { db } from '@/db'
import { users } from '@/schema'
import { eq } from 'drizzle-orm'
// import { redirect } from 'next/navigation'

export default async function SettingsForm({
	username,
	currentCourse,
	currentClass
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
			// TODO: look up classId
			// TODO: look up courseId
			await db
				.update(users)
				.set({ currentClassId: 1, currentCourseId: 1 }) // TODO: replace with actual ids
        .where(eq(users.username, username!))
		} catch (err) {
			// TODO: handle error, toast?
			console.log(`🎈 err:`, err)
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
				<label htmlFor="currentClass">Current Class: </label>
				<input
					type="text"
					id="currentClass"
					name="currentClass"
					defaultValue={currentClass || ''}
				/>
				<button>CLICK</button>
			</form>
		</>
	)
}
