import { validateRequest } from '@/auth'
import { db } from '@/db'
import { resources, votes } from '@/schema'
export default async function Form({ str }: { str: string | undefined }) {
	async function createResource(formData: FormData) {
		'use server'
		const { user } = await validateRequest()
		const siteUrl = formData.get('siteUrl') as string
		const classNumber = formData.get('classNumber') as string
		const isLiked = formData.get('isLiked')

		// insert (optional) and return resource
		let storedResource = await db.query.resources.findFirst({
			where: (resources, {eq}) => eq(resources.link, siteUrl),
		});

		if (!storedResource) {
		[storedResource] = await db
			.insert(resources)
			.values({ link: siteUrl })
			.returning()
		}
		// look up class
		const currentClass = await db.query.classes.findFirst({
			where: (classes, { eq }) => eq(classes.classNumber, classNumber),
		})

		// TODO: throw error, or ask for class if !currentClass

		// add vote
		await db.insert(votes).values({
			userId: user!.id,
			resourceId: storedResource!.id,
			classId: currentClass?.id!,
			isLiked: true,
			})
			.onConflictDoNothing({ // TODO: add values object
				target: [
					votes.userId,
					votes.classId,
					votes.resourceId
				], // Note: must match columns in schema.ts (manual for Drizzle v0.30)
		})
	}
	return (
		<form action={createResource}>
			<label htmlFor="siteUrl">Resource Url: </label>
			<input type="text" id="siteUrl" name="siteUrl" defaultValue={str || ''} />
			<label htmlFor="classNumber">Current Class: </label>
			<input
				type="number"
				id="classNumber"
				name="classNumber"
				defaultValue={str || ''}
			/>
			<label htmlFor="isLiked">isLiked: </label>
			<input type="text" id="isLiked" name="isLiked" defaultValue={str || ''} />
			<button>CLICK</button>
		</form>
	)
}
