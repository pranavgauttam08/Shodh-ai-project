export async function GET() {
  const contests = [
    {
      id: 1,
      title: "CodeMaster Challenge 2025",
      description: "Solve 5 challenging problems in 2 hours. Test your algorithmic skills!",
      status: "ONGOING",
      totalProblems: 5,
      totalParticipants: 342,
    },
    {
      id: 2,
      title: "Web Dev Sprint",
      description: "Build full-stack applications with modern technologies.",
      status: "UPCOMING",
      totalProblems: 3,
      totalParticipants: 128,
    },
    {
      id: 3,
      title: "Data Structures Bootcamp",
      description: "Master advanced data structures and algorithms.",
      status: "COMPLETED",
      totalProblems: 8,
      totalParticipants: 567,
    },
  ]

  return Response.json(contests)
}
