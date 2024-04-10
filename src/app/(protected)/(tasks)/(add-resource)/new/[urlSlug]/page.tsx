import { validateRequest } from '@/auth'
import Form from '../components/Form'
import { db } from '@/db'
import { redirect } from 'next/navigation'
export default async function NewForm({
	params,
}: {
	params: { urlSlug: string }
}) {
	// TODO: reduce roundtrips
	const { user } = await validateRequest()
	const { currentClassId } = user! // under protected route layout
	if (!currentClassId) return redirect(`/`) //TODO: show error in toast
	const classInfo = await db.query.classes.findFirst({
		where: (classes, { eq }) => eq(classes.id, currentClassId),
		columns: {
			classNumber: true
		}
	})
	return <Form url={params.urlSlug} currentClass={classInfo?.classNumber} />
}
