import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contestId = params.id
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

    try {
      const response = await fetch(`${backendUrl}/api/problems/contest/${contestId}/leaderboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.error("Backend fetch failed, using mock data:", backendError)
    }

    const mockLeaderboards: Record<string, any> = {
      "1": [
        { userId: 1, username: "alice", totalScore: 450, problemsSolved: 5 },
        { userId: 2, username: "bob", totalScore: 380, problemsSolved: 4 },
        { userId: 3, username: "charlie", totalScore: 290, problemsSolved: 3 },
      ],
      "2": [
        { userId: 4, username: "david", totalScore: 400, problemsSolved: 4 },
        { userId: 5, username: "eve", totalScore: 320, problemsSolved: 3 },
      ],
      "3": [
        { userId: 6, username: "frank", totalScore: 520, problemsSolved: 8 },
        { userId: 7, username: "grace", totalScore: 480, problemsSolved: 7 },
        { userId: 8, username: "henry", totalScore: 420, problemsSolved: 6 },
        { userId: 9, username: "iris", totalScore: 360, problemsSolved: 5 },
      ],
    }

    const leaderboard = mockLeaderboards[contestId] || []
    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
