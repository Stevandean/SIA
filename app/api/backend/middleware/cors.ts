// @ts-nocheck
import { NextResponse } from "next/server"

export function withCORS(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  return response
}

export function handleOptions() {
  return withCORS(new NextResponse(null, { status: 200 }))
}
