import { db } from '@/db'
import { courseResources, resources, votes } from '@/schema'
import { eq } from 'drizzle-orm'
export default async function Form({ str }: { str: string | undefined }) {
	async function createResource(formData: FormData) {
		'use server'
		const siteUrl = formData.get('siteUrl') as string
		const classNumber = formData.get('classNumber')
		const isLiked = formData.get('isLiked')

		// insert (optional) and return resource
		let storedResource
		if (siteUrl) {
			storedResource = await db
				.insert(resources)
				.values({ link: siteUrl })
				.onConflictDoNothing({ target: resources.link })
				.returning()
		}
		// use courseResource to add a vote

		// add vote
		await db.insert(votes).values({}).onConflictDoNothing({ // TODO: add values object
			target: [
				votes.userId,
				votes.classId,
				votes.courseResourcesId
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
