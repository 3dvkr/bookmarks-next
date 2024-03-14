import Image from "next/image";
import styles from "./page.module.css";

import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";

export default async function Home() {
  const { user } = await validateRequest();
	if (!user) {
		return redirect("/login");
	}
	return <h1>Hi, {user.username}!</h1>;
}
