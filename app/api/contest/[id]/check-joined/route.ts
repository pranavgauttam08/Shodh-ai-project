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
    const hasJoined = joinedArray.includes(Number(contestId))

    console.log("[v0] Checking join status:", { userId, contestId, hasJoined, joinedArray })
    return Response.json({ hasJoined })
  } catch (error) {
    console.error("[v0] Error checking contest join status:", error)
    return Response.json({ hasJoined: false })
  }
}
