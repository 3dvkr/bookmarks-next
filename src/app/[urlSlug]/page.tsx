import { redirect } from "next/navigation"

export default async function Slug({params}: any) {

	// look for params (if yes, parse URL and redirect to /new)
	console.log(`🎈 params:`,  params)
  const slug = params.urlSlug
  console.log(`🎈 slug:`,  slug)
	// const slug = params.url
	// if (slug && slug.length > 0) {
	// 	// redirect(`/new/${slug}`)
	// 	console.log(`🎈 slug:`,  slug)
	// 	return <h1>{slug}</h1>
	// }
  redirect(`/new/${slug}`)
}

/* 

// website.com/shayhowe.com

// website.com/new/shayhowe.com

// website.com/new/ <-- form

*/