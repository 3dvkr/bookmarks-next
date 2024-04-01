import Link from 'next/link'

export default function Home() {
	const domain = 'localhost:3000'
	const website = 'http://' + domain
	const highlight = {
		background: 'goldenrod',
		color: 'black',
		paddingInline: '0.5ch',
		marginInline: '0.1ch',
	}
	return (
		<div style={{ letterSpacing: '0.25ch', lineHeight: '1.7' }}>
			<h1>Bookmarks, together</h1>
			<Link href="/login/">Log in</Link>
			 <p>
				<span style={{ fontWeight: '900' }}>Async learning is hard.</span>{' '}
				Crowdsource the resources you need with past, current, and future
				students. <Link href="/login">Get started.</Link>
			</p>
			<h2>Find a resource</h2>
			<p>Find resources you need based on where you are in your course:</p>
			<p>
				<code>
					{website}/<span style={highlight}>class-number</span>
				</code>
			</p>
			<p>
				e.g.{' '}
				<Link href="/2">
					{website}/<span style={highlight}>2</span>
				</Link>
			</p>
			<h2>Pay it forward</h2>
			<p>
				Add feedback on a resource <Link href="/new">with a form</Link>, or
				using your address bar:{' '}
				<code>
					https://
					<span style={highlight}>{domain}/</span>
					&lt;url&gt;
				</code>
				.
			</p>
			<p>
				e.g.{' '}
				<code>
					https://
					<span style={highlight}>{domain}/</span>
					www.google.com
				</code>
			</p> 
			</div>
	)
}