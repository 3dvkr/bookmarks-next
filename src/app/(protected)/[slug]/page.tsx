import { validateRequest } from '@/auth'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export default async function Slug({ params }: any) {
	const { slug } = params
	const { user } = await validateRequest()
	const { currentCourseId } = user!
	if (!Number(slug)) {
		return redirect(`/new/${slug}`)
	} else {
		const currentCourseInfo = await db.query.courses.findFirst({
			where: (courses) => eq(courses.id, currentCourseId!),
			columns: { name: true },
		})
		if (!currentCourseInfo) return redirect(`/`) // TODO: show error, toast
		return redirect(
			`/course/${currentCourseInfo.name.replaceAll(' ', '-')}/${slug}`
		)
	}
}
