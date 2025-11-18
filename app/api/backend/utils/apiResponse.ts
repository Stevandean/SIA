// @ts-nocheck
import { NextResponse } from "next/server"
import { withCORS } from "@/middleware/cors"

// 🔹 Base response helper
function jsonResponse(success, message, data = null, status = 200) {
  const payload = { success, message }

  if (data !== null) {
    payload.data = data
  }

  return withCORS(NextResponse.json(payload, { status }))
}

// 200 OK
export function success(message = "OK", data = null) {
  return jsonResponse(true, message, data, 200)
}

// 201 Created
export function created(message = "Created", data = null) {
  return jsonResponse(true, message, data, 201)
}

// 400 Bad Request
export function fail(message = "Bad Request", status = 400, data = null) {
  return jsonResponse(false, message, data, status)
}

// 401 Unauthorized
export function unauthorized(message = "Unauthorized") {
  return jsonResponse(false, message, null, 401)
}

// 403 Forbidden
export function forbidden(message = "Forbidden") {
  return jsonResponse(false, message, null, 403)
}

// 500 Internal Server Error
export function serverError(error) {
  const message = error?.message || "Terjadi kesalahan pada server"
  return jsonResponse(false, message, null, 500)
}
