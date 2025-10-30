import { cookies } from "next/headers"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId } = body
    const contestId = params.id

    console.log("[v0] Check join status request:", { userId, contestId })

    if (!userId || !contestId) {
      return Response.json({ hasJoined: false }, { status: 200 })
    }

    const cookieStore = await cookies()
    const joinedContestsKey = `joined_contests_${userId}`
    const existingJoined = cookieStore.get(joinedContestsKey)?.value || ""
    const joinedArray = existingJoined ? existingJoined.split(",").map(Number) : []
    const hasJoined = joinedArray.includes(Number(contestId))

    console.log("[v0] Join status checked:", { userId, contestId, hasJoined, joinedArray })
    return Response.json({ hasJoined })
  } catch (error) {
    console.error("[v0] Error checking contest join status:", error)
    return Response.json({ hasJoined: false }, { status: 200 })
  }
}
