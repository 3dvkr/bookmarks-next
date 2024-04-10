import { redirect } from 'next/navigation'
import { validateRequest } from '@/auth'

export default async function Layout() {
	const { user } = await validateRequest()
	const { currentCourseId, currentClassId } = user!
	if (currentCourseId === null || currentClassId === null) {
		let redirectRoute = `/users/${user?.username}?`

		if (currentCourseId === null && currentClassId === null) {
			redirectRoute += `missingCourse=true&missingClass=true`
		} else if (currentCourseId === null) {
			redirectRoute += `missingCourse=true`
		} else if (currentClassId === null) {
			redirectRoute += `missingClass=true`
		}
		return redirect(redirectRoute)
	}
}
