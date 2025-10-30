import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/problems/${params.id}/test-cases`, {
      headers: { "Content-Type": "application/json" },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Fetch test cases error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
