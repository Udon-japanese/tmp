import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthOptions";

export default async function getSession() {
  return await getServerSession(authOptions);
}