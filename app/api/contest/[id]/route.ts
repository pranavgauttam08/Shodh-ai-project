export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  console.log("[v0] Fetching contest with ID:", id)

  // Mock data for contests
  const contests: Record<string, any> = {
    "1": {
      id: 1,
      title: "Shodh-a-Code Championship 2024",
      description: "The ultimate coding competition to test your algorithmic skills",
      status: "ONGOING",
      startTime: "2024-10-30T10:00:00Z",
      endTime: "2024-10-30T14:00:00Z",
      totalProblems: 5,
      totalParticipants: 150,
    },
    "2": {
      id: 2,
      title: "Data Structures Mastery",
      description: "Master the fundamentals of data structures",
      status: "UPCOMING",
      startTime: "2024-11-05T10:00:00Z",
      endTime: "2024-11-05T14:00:00Z",
      totalProblems: 4,
      totalParticipants: 200,
    },
    "3": {
      id: 3,
      title: "Data Structures Bootcamp",
      description: "Master advanced data structures and algorithms.",
      status: "COMPLETED",
      startTime: "2024-10-20T10:00:00Z",
      endTime: "2024-10-27T14:00:00Z",
      totalProblems: 8,
      totalParticipants: 567,
    },
  }

  const contest = contests[id]

  if (!contest) {
    console.log("[v0] Contest not found, returning default mock data")
    // Return a default contest for any ID to ensure the page loads
    return Response.json({
      id: Number.parseInt(id) || 1,
      title: `Contest ${id}`,
      description: "A coding contest to test your skills",
      status: "ONGOING",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      totalProblems: 5,
      totalParticipants: 100,
    })
  }

  console.log("[v0] Contest found:", contest.title)
  return Response.json(contest)
}
