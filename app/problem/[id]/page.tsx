"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

interface Problem {
  id: number
  title: string
  difficulty: string
  description: string
  timeLimit: number
  memoryLimit: number
  inputFormat?: string
  outputFormat?: string
  constraints?: string
}

interface TestCase {
  id: number
  input: string
  expectedOutput: string
  isHidden: boolean
}

interface SubmissionResult {
  id: number
  status: string
  verdict: string
  output?: string
  error?: string
  executionTime?: number
  memoryUsed?: number
}

export default function ProblemPage() {
  const params = useParams()
  const problemId = params.id as string
  const [problem, setProblem] = useState<Problem | null>(null)
  const [testCases, setTestCases] = useState<TestCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("JAVA")
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState<SubmissionResult | null>(null)
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchProblem()
  }, [problemId])

  useEffect(() => {
    if (submission && submission.status === "JUDGING" && pollInterval === null) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/submission/${submission.id}`)
          if (response.ok) {
            const updated = await response.json()
            setSubmission(updated)
            if (updated.status !== "JUDGING") {
              clearInterval(interval)
              setPollInterval(null)
            }
          }
        } catch (err) {
          console.error("[v0] Error polling submission:", err)
        }
      }, 1000)
      setPollInterval(interval)
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [submission, pollInterval])

  const fetchProblem = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/problem/${problemId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch problem: ${response.status}`)
      }
      const data = await response.json()
      setProblem(data)
    } catch (err) {
      console.error("[v0] Failed to fetch problem:", err)
      setError(err instanceof Error ? err.message : "Failed to load problem")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please write some code before submitting")
      return
    }

    const user = localStorage.getItem("user")
    if (!user) {
      setError("Please login to submit solutions")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const userData = JSON.parse(user)

      const response = await fetch("/api/submission/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.id,
          problemId: Number.parseInt(problemId),
          contestId: 1,
          code,
          language,
        }),
      })

      if (!response.ok) throw new Error("Submission failed")
      const result = await response.json()
      setSubmission(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const getVerdictColor = (verdict: string | undefined) => {
    switch (verdict) {
      case "ACCEPTED":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "WRONG_ANSWER":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "RUNTIME_ERROR":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "TIME_LIMIT_EXCEEDED":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "COMPILATION_ERROR":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const getVerdictMessage = (verdict: string | undefined) => {
    switch (verdict) {
      case "ACCEPTED":
        return "✓ Correct Answer"
      case "WRONG_ANSWER":
        return "✗ Wrong Answer"
      case "RUNTIME_ERROR":
        return "⚠ Runtime Error"
      case "TIME_LIMIT_EXCEEDED":
        return "⏱ Time Limit Exceeded"
      case "COMPILATION_ERROR":
        return "⚠ Compilation Error"
      default:
        return verdict || "Pending"
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </main>
    )
  }

  if (error && !problem) {
    return (
      <main className="min-h-screen bg-slate-950">
        <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link href="/contests" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
              ← Back to Contests
            </Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-red-400">
            {error || "Problem not found"}
          </div>
        </div>
      </main>
    )
  }

  if (!problem) return null

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/contests" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Contests
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 mb-2">{problem.title}</h1>
              <p className="text-slate-400 text-sm">Points: {problem.difficulty}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                problem.difficulty === "EASY"
                  ? "bg-green-500/20 text-green-400"
                  : problem.difficulty === "MEDIUM"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-50 mb-4">Description</h2>
              <p className="text-slate-300 mb-6">{problem.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">Input Format</h3>
                  <p className="text-slate-400 text-sm">{problem.inputFormat || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">Output Format</h3>
                  <p className="text-slate-400 text-sm">{problem.outputFormat || "Not specified"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">Constraints</h3>
                  <p className="text-slate-400 text-sm">{problem.constraints || "Not specified"}</p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Time Limit</div>
                    <div className="text-slate-50 font-semibold">{problem.timeLimit}s</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs mb-1">Memory Limit</div>
                    <div className="text-slate-50 font-semibold">{problem.memoryLimit}MB</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Code Editor and Submission */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-50 mb-4">Solution</h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded p-3 text-red-400 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded text-slate-50 focus:outline-none focus:border-purple-500"
                >
                  <option value="JAVA">Java</option>
                  <option value="PYTHON">Python</option>
                  <option value="CPP">C++</option>
                </select>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your code here..."
                className="w-full h-64 bg-slate-900 border border-slate-700 rounded p-4 text-slate-50 font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
              />

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                {submitting ? "Submitting..." : "Submit Solution"}
              </button>
            </div>

            {submission && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-slate-800/50 border rounded-lg p-6 ${getVerdictColor(submission.verdict)}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{getVerdictMessage(submission.verdict)}</h3>
                  {submission.status === "JUDGING" && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-400">Status:</span>
                    <span className="ml-2 font-semibold">{submission.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Verdict:</span>
                    <span className="ml-2 font-semibold">{submission.verdict || "Pending"}</span>
                  </div>
                  {submission.executionTime !== undefined && (
                    <div>
                      <span className="text-slate-400">Execution Time:</span>
                      <span className="ml-2 font-semibold">{submission.executionTime}ms</span>
                    </div>
                  )}
                  {submission.memoryUsed !== undefined && (
                    <div>
                      <span className="text-slate-400">Memory Used:</span>
                      <span className="ml-2 font-semibold">{submission.memoryUsed}MB</span>
                    </div>
                  )}
                </div>

                {submission.error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm font-mono">
                    {submission.error}
                  </div>
                )}

                {submission.output && (
                  <div className="mt-4">
                    <div className="text-slate-400 text-xs mb-2">Output:</div>
                    <div className="p-3 bg-slate-900/50 border border-slate-700 rounded text-slate-50 text-sm font-mono">
                      {submission.output}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
