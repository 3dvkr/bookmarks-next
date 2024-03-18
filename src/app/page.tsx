import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";

export default async function Home({params}: any) {
  const { user } = await validateRequest();
	if (!user) {
		return redirect("/login");
	}
	// look for params (if yes, parse URL and redirect to /new)
	console.log(`🎈 params:`,  params)
	// const slug = params.url
	// if (slug && slug.length > 0) {
	// 	// redirect(`/new/${slug}`)
	// 	console.log(`🎈 slug:`,  slug)
	// 	return <h1>{slug}</h1>
	// }
	return <h1>Hi, {user.username}!</h1>;
}

// recco.io/shayhowe.com

// recco.io/new/shayhowe.com



// /app/[url]/page.tsx