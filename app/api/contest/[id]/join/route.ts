import { cookies } from "next/headers"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId } = body
    const contestId = params.id

    console.log("[v0] Join request received:", { userId, contestId })

    if (!userId || !contestId) {
      console.log("[v0] Missing userId or contestId")
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
      httpOnly: false, // Allow client-side access
      sameSite: "lax",
    })

    console.log("[v0] User joined contest successfully:", { userId, contestId, joinedArray })
    return Response.json({ success: true, message: "Successfully joined contest", hasJoined: true })
  } catch (error) {
    console.error("[v0] Error joining contest:", error)
    return Response.json({ success: false, message: "Failed to join contest", hasJoined: false }, { status: 200 })
  }
}
