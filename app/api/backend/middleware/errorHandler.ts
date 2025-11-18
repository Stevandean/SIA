// @ts-nocheck
import { NextResponse } from "next/server"
import { withCORS } from "./cors"

export function withErrorHandling(handler) {
  return async (req, ...args) => {
    try {
      const result = await handler(req, ...args)
      return withCORS(result)
    } catch (error) {
      console.error("❌ API Error:", error)
      const status = error.status || 500
      const message = error.message || "Terjadi kesalahan server"
      return withCORS(NextResponse.json({ error: message }, { status }))
    }
  }
}
