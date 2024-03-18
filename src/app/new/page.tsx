import Form from "./components/Form"
export default async function NewForm({ params }: any ) {
  console.log(`🎈 params from new:`,  params)
  return <Form/>
}