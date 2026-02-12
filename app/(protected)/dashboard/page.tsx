import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { isAdminLike } from "@/lib/owner-roles"

export const dynamic = "force-dynamic"

export default async function DashboardHubPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (isAdminLike(user.role)) {
    redirect("/dashboard/admin")
  }
  if (user.role === "seller") {
    redirect("/dashboard/seller")
  }
  redirect("/dashboard/buyer")
}
