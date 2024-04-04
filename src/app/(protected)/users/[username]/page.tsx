import { classes, courses, users } from '@/schema'
import { db } from '@/db'
import SettingsForm from './components/SettingsForm'
import { validateRequest } from '@/auth'
import { eq } from 'drizzle-orm'

export default async function Page() {
	const { user } = await validateRequest()
	const [userInfo] = await db
		.select({
			username: users.username,
			currentCourse: courses.name,
      courseId: courses.id,
			currentClass: classes.classNumber,
      classId: classes.id,
		})
		.from(users)
		.where(eq(users.id, user!.id)) // user exists because protected route
		.leftJoin(courses, eq(users.currentCourseId, courses.id))
		.leftJoin(classes, eq(users.currentClassId, classes.id))
	return (
		<>
			<h1>User Profile Page</h1>
			<SettingsForm
				username={userInfo.username}
				currentCourse={userInfo.currentCourse}
				currentClass={userInfo.currentClass}
			/>
		</>
	)
}
