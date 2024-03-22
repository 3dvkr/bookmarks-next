export default async function Form({ str }: {str: string | undefined}) {
	async function createResource(formData: FormData) {
		'use server'
		const siteUrl = formData.get('siteUrl')
		const classNumber = formData.get('classNumber')
		const isLiked = formData.get('isLiked')
		console.log(`🎈 form stuff :`, {
			siteUrl,
			classNumber,
			isLiked
		}  )
	}
	return (
		<form action={createResource}>
			<label htmlFor="siteUrl">Resource Url: </label>
			<input type="text" id="siteUrl" name="siteUrl" defaultValue={str || ''} />
			<label htmlFor="classNumber">Current Class: </label>
			<input type="number" id="classNumber" name="classNumber" defaultValue={str || ''} />
			<label htmlFor="isLiked">isLiked: </label>
			<input type="text" id="isLiked" name="isLiked" defaultValue={str || ''} />
			<button>CLICK</button>
		</form>
	)
}
