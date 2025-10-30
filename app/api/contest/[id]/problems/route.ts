export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // Mock problems data
  const problemsByContest: Record<string, any[]> = {
    "1": [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "EASY",
        description: "Find two numbers that add up to a target",
        timeLimit: 1,
        memoryLimit: 256,
      },
      {
        id: 2,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "MEDIUM",
        description: "Find the longest substring without repeating characters",
        timeLimit: 2,
        memoryLimit: 256,
      },
      {
        id: 3,
        title: "Median of Two Sorted Arrays",
        difficulty: "HARD",
        description: "Find the median of two sorted arrays",
        timeLimit: 2,
        memoryLimit: 512,
      },
    ],
    "2": [
      {
        id: 4,
        title: "Binary Tree Level Order Traversal",
        difficulty: "MEDIUM",
        description: "Traverse a binary tree level by level",
        timeLimit: 1,
        memoryLimit: 256,
      },
      {
        id: 5,
        title: "Graph Coloring",
        difficulty: "HARD",
        description: "Color a graph with minimum colors",
        timeLimit: 3,
        memoryLimit: 512,
      },
    ],
  }

  const problems = problemsByContest[id] || []

  return Response.json(problems)
}
