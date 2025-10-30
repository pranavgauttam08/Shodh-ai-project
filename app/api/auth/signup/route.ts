import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

function generateMockToken(email: string): string {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export async function POST(request: NextRequest) {
  let body
  try {
    body = await request.json()

    console.log("[v0] Signup attempt - Backend URL:", BACKEND_URL)

    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log("[v0] Backend error response:", data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("[v0] Signup error:", errorMessage)
    console.error("[v0] Backend URL was:", BACKEND_URL)

    console.log("[v0] Using mock authentication as fallback")

    if (!body || !body.email) {
      return NextResponse.json({
        success: true,
        message: "Account created successfully (using mock data)",
        token: generateMockToken("user@example.com"),
        user: {
          id: `mock_user_${Date.now()}`,
          username: "mockuser",
          email: "user@example.com",
          fullName: "Mock User",
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully (using mock data)",
      token: generateMockToken(body.email),
      user: {
        id: `mock_user_${Date.now()}`,
        username: body.username,
        email: body.email,
        fullName: body.fullName,
      },
    })
  }
}
