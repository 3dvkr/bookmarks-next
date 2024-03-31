import { validateRequest } from '@/auth'
import { db } from '@/db'
import { redirect } from 'next/navigation'

export default async function Slug({ params }: any) {
	const { slug } = params
	const { user } = await validateRequest()

	if (!Number(slug)) {
		return redirect(`/new/${slug}`)
	} else {
		// show resources for class
		const { currentCourseId } = user!
		if (currentCourseId === null) {
			redirect(`/`) // TODO: redirect to user profile, or show selection for currentCourse
		} else {
			const currentCourseInfo = await db.query.courses.findFirst({
				where: (courses, { eq }) => eq(courses.id, currentCourseId),
			})
			// `course` is not dynamic;
			return redirect(`/course/${currentCourseId}/${slug}`)
		}
	}
}
