export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const contestId = params.id

    if (!userId || !contestId) {
      return Response.json({ error: "Missing userId or contestId" }, { status: 400 })
    }

    // Mock: Store joined contests in localStorage-like structure
    // In production, this would update a ContestParticipant table in the database
    const joinedContests = JSON.parse(localStorage.getItem("joinedContests") || "{}")
    if (!joinedContests[userId]) {
      joinedContests[userId] = []
    }
    if (!joinedContests[userId].includes(Number(contestId))) {
      joinedContests[userId].push(Number(contestId))
    }
    localStorage.setItem("joinedContests", JSON.stringify(joinedContests))

    return Response.json({ success: true, message: "Successfully joined contest" })
  } catch (error) {
    console.error("[v0] Error joining contest:", error)
    return Response.json({ error: "Failed to join contest" }, { status: 500 })
  }
}
