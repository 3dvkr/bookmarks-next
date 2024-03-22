import { redirect } from "next/navigation"

export default async function Slug({params}: any) {
  const slug = params.urlSlug
  redirect(`/new/${slug}`)
}
