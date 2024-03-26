import { validateRequest } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Slug({ params }: any) {
	const { slug } = params
	const { user } = await validateRequest()

	if (!Number(slug)) {
		return redirect(`/new/${slug}`)
	} else {
		return redirect(`/course/${user!.currentCourseId}/${slug}`)
	}
}
