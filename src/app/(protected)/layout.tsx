import { redirect } from 'next/navigation'
import { validateRequest } from '@/auth'

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const { user } = await validateRequest()
	if (!user) {
		return redirect('/login')
	}
	// TODO: save/update {[course]: <classNum>} to local?
	return (
		<>
			{user && <p>{user.username}</p>}
			{children}
		</>
	)
}
