import { getAllCashRevenues, createCashRevenue } from "../../service/revenue/cashRevenue.service"
import { success, created, fail, unauthorized, serverError } from "@/app/api/backend/utils/apiResponse"
import { requireAuth } from "../../middleware/auth"

export async function getCashRevenues() {
  try {
    const user = await requireAuth()
    if (!user) return unauthorized("Akses ditolak")

    const data = await getAllCashRevenues()
    return success("Data cash revenue berhasil diambil", { cashRevenues: data })
  } catch (error) {
    return serverError(error)
  }
}

export async function postCashRevenue(request: Request) {
  try {
    const user = await requireAuth()
    if (!user) return unauthorized("Akses ditolak")

    const body = await request.json()
    const { cashRevenue, journal } = await createCashRevenue(body, user)
    return created("Transaksi kas berhasil dibuat", { cashRevenue, journal })
  } catch (error) {
    return serverError(error)
  }
}
