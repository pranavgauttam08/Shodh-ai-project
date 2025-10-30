export async function POST(request: Request) {
  const body = await request.json()

  // Mock submission response
  const submission = {
    id: Math.floor(Math.random() * 10000),
    problemId: body.problemId,
    userId: body.userId,
    code: body.code,
    language: body.language,
    status: "PENDING",
    verdict: null,
    executionTime: null,
    memory: null,
    submittedAt: new Date().toISOString(),
  }

  return Response.json(submission)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  // Mock submissions list
  const submissions = [
    {
      id: 1,
      problemId: 1,
      userId: userId || 1,
      code: "public class Solution { ... }",
      language: "JAVA",
      status: "ACCEPTED",
      verdict: "ACCEPTED",
      executionTime: 245,
      memory: 12.5,
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 2,
      problemId: 1,
      userId: userId || 1,
      code: "public class Solution { ... }",
      language: "JAVA",
      status: "WRONG_ANSWER",
      verdict: "WRONG_ANSWER",
      executionTime: 198,
      memory: 11.2,
      submittedAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]

  return Response.json(submissions)
}
