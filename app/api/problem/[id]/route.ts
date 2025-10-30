export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  // Mock problems data - same as in contest problems route
  const allProblems: Record<string, any> = {
    "1": {
      id: 1,
      title: "Two Sum",
      difficulty: "EASY",
      description:
        "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
      timeLimit: 1,
      memoryLimit: 256,
      inputFormat: "First line: n (array size), Second line: n integers, Third line: target",
      outputFormat: "Two indices of the numbers that add up to target",
      constraints: "2 <= n <= 10^4, -10^9 <= nums[i] <= 10^9",
    },
    "2": {
      id: 2,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "MEDIUM",
      description: "Given a string s, find the length of the longest substring without repeating characters.",
      timeLimit: 2,
      memoryLimit: 256,
      inputFormat: "A string s",
      outputFormat: "Length of the longest substring",
      constraints: "0 <= s.length <= 5 * 10^4",
    },
    "3": {
      id: 3,
      title: "Median of Two Sorted Arrays",
      difficulty: "HARD",
      description:
        "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      timeLimit: 2,
      memoryLimit: 512,
      inputFormat: "First line: m, n. Second line: m integers. Third line: n integers.",
      outputFormat: "The median as a double",
      constraints: "nums1.length == m, nums2.length == n",
    },
    "4": {
      id: 4,
      title: "Binary Tree Level Order Traversal",
      difficulty: "MEDIUM",
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      timeLimit: 1,
      memoryLimit: 256,
      inputFormat: "Binary tree in level order",
      outputFormat: "Level order traversal",
      constraints: "The number of nodes in the tree is in the range [0, 2000]",
    },
    "5": {
      id: 5,
      title: "Graph Coloring",
      difficulty: "HARD",
      description:
        "Color a graph with minimum number of colors such that no two adjacent vertices have the same color.",
      timeLimit: 3,
      memoryLimit: 512,
      inputFormat: "Number of vertices and edges, followed by edge list",
      outputFormat: "Minimum number of colors needed",
      constraints: "1 <= V <= 100, 0 <= E <= V*(V-1)/2",
    },
  }

  const problem = allProblems[id]

  if (!problem) {
    return Response.json({ error: "Problem not found" }, { status: 404 })
  }

  return Response.json(problem)
}
