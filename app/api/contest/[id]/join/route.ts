import { cookies } from "next/headers"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const contestId = params.id

    if (!userId || !contestId) {
      return Response.json({ error: "Missing userId or contestId" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const joinedContestsKey = `joined_contests_${userId}`
    const existingJoined = cookieStore.get(joinedContestsKey)?.value || ""
    const joinedArray = existingJoined ? existingJoined.split(",").map(Number) : []

    if (!joinedArray.includes(Number(contestId))) {
      joinedArray.push(Number(contestId))
    }

    // Store as comma-separated string in cookie
    cookieStore.set(joinedContestsKey, joinedArray.join(","), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    console.log("[v0] User joined contest:", { userId, contestId, joinedArray })
    return Response.json({ success: true, message: "Successfully joined contest" })
  } catch (error) {
    console.error("[v0] Error joining contest:", error)
    return Response.json({ error: "Failed to join contest" }, { status: 500 })
  }
}
