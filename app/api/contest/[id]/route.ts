export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

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
    return Response.json({ error: "Contest not found" }, { status: 404 })
  }

  return Response.json(contest)
}
