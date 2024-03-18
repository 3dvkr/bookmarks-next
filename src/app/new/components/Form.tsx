export default async function Form({ str }: any) {
	async function createResource(formData: FormData) {
		'use server'
		const siteUrl = formData.get('siteUrl')
		console.log(`🎈 siteUrl:`, siteUrl)
	}
	return (
		<form action={createResource}>
      {/* action as a prop makes it user interactive therefore client component (Lee Rob) */}
			<label htmlFor="siteUrl">Url: </label>
			<input type="text" id="siteUrl" name="siteUrl" defaultValue={str || ''} />
			<button>CLICK</button>
		</form>
	)
}
