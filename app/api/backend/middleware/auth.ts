// @ts-nocheck
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function requireAuth(requiredRole?: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw { status: 401, message: "Unauthorized — silakan login terlebih dahulu" }
  }

  const user = session.user

  if (requiredRole && user.role !== requiredRole && user.role !== "ADMIN") {
    throw { status: 403, message: "Forbidden — Anda tidak memiliki izin" }
  }

  return user
}
