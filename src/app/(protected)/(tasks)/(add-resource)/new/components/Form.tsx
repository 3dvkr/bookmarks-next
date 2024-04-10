import { validateRequest } from '@/auth'
import { db } from '@/db'
import { resources, votes } from '@/schema'
import { redirect } from 'next/navigation'

export default async function Form({
	url,
	currentClass,
}: {
	url?: string | undefined
	currentClass?: string | undefined
}) {
	async function createResource(formData: FormData) {
		'use server'
		const { user } = await validateRequest()
		const siteUrl = formData.get('siteUrl') as string
		const classNumber = formData.get('classNumber') as string
		const isLiked = formData.get('isLiked')
		try {
			// insert (optional) and return resource
		let storedResource = await db.query.resources.findFirst({
			where: (resources, { eq }) => eq(resources.link, siteUrl),
		})

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

		// add vote; TODO: add option to change vote
		await db
			.insert(votes)
			.values({
				userId: user!.id,
				resourceId: storedResource!.id,
				classId: currentClass?.id!,
				isLiked: isLiked === "liked",
			})
			.onConflictDoUpdate({
				// TODO: add values object
				target: [votes.userId, votes.classId, votes.resourceId], // Note: must match columns in schema.ts (manual for Drizzle v0.30)
				set: {isLiked: isLiked === "liked"} // TODO: update cache in utils/ts
			})}catch (err) {
				// TODO: handle error, toast?
				console.log(`🎈 err:`,  err)
			} finally {
				redirect(`/${currentClass}`)
			}
	}
	return (
		<form action={createResource}>
			<label htmlFor="siteUrl">Resource Url: </label>
			<input type="text" id="siteUrl" name="siteUrl" defaultValue={url || ''} />
			<label htmlFor="classNumber">Current Class: </label>
			<input
				type="number"
				id="classNumber"
				name="classNumber"
				defaultValue={currentClass || ''}
			/>

			<fieldset>
				<legend>
					Did this resource help you understand your current class material?
				</legend>
				<div>
					<input type="radio" id="liked" name="isLiked" value="liked" />
					<label htmlFor="isLiked">Yes</label>
				</div>
				<div>
					<input
						type="radio"
						id="disliked"
						name="isLiked"
						value="disliked"
					/>
					<label htmlFor="isLiked">No</label>
				</div>
			</fieldset>
			<button>CLICK</button>
		</form>
	)
}
