const joinedContests: Record<string, number[]> = {}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const contestId = params.id

    if (!userId || !contestId) {
      return Response.json({ error: "Missing userId or contestId" }, { status: 400 })
    }

    const userContests = joinedContests[userId] || []
    const hasJoined = userContests.includes(Number(contestId))

    console.log("[v0] Checking join status:", { userId, contestId, hasJoined })
    return Response.json({ hasJoined })
  } catch (error) {
    console.error("[v0] Error checking contest join status:", error)
    return Response.json({ hasJoined: false })
  }
}
