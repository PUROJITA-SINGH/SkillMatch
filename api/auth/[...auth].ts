// Better Auth API route handler
// This handles all authentication endpoints: /api/auth/*

import { auth } from "../../lib/auth"

export async function GET(request: Request) {
  return auth.handler(request)
}

export async function POST(request: Request) {
  return auth.handler(request)
}
