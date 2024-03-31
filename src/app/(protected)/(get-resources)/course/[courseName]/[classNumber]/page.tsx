import { ClassVotes, getVotedResources } from '@/utils'

function ResourceInfo({ info }: {info: ClassVotes}) {
	return (
		<div style={{ margin: '1em', padding: '1em', border: '1px solid fuchsia' }}>
			<p>Link: {info.link}</p>
			<p>Likes: {info.likes}</p>
			<p>Dislikes: {info.dislikes}</p>
		</div>
	)
}

export default async function Home({
	params,
}: {
	params: { courseName: string; classNumber: string }
}) {
	const votedResources = await getVotedResources(params.classNumber)
	return (
		<>
			{votedResources.map((info, i) => (
				<ResourceInfo key={i} info={info} />
			))}
		</>
	)
}
