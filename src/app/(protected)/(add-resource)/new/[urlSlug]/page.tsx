import Form from "../components/Form"
export default async function NewForm({ params }: any ) {
  return <Form str={params.urlSlug}/>
}