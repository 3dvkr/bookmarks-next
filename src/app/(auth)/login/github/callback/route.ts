// import { v4 as uuidv4 } from 'uuid'
import { github, lucia } from '@/auth'
import { db, users } from '@/db'
import { cookies } from 'next/headers'
import { OAuth2RequestError } from 'arctic'
import { generateId } from 'lucia'

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url)
	const code = url.searchParams.get('code')
	const state = url.searchParams.get('state')
	console.log(`🎈 code:`, code)
	const storedState = cookies().get('github_oauth_state')?.value ?? null
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		})
	}

	try {
		const tokens = await github.validateAuthorizationCode(code)
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		})
		const githubUser: GitHubUser = await githubUserResponse.json()

		// Replace this with your own DB client.
		const existingUser = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.githubId, githubUser.id),
		})

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			cookies().set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes
			)
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/',
				},
			})
		}

		const userId = generateId(15)

		// Replace this with your own DB client.
		await db.insert(users).values({
			id: userId,
			githubId: githubUser.id,
			username: githubUser.login,
		})
		// .returning()

		const session = await lucia.createSession(userId, {})
		const sessionCookie = lucia.createSessionCookie(session.id)
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		)
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		})
	} catch (e: any) {
		console.log(`🎈 e:`, e.message, e)
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			})
		}
		return new Response(null, {
			status: 500,
		})
	}
}

interface GitHubUser {
	id: number
	login: string
}