"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Editor from "@monaco-editor/react"
import { motion } from "framer-motion"

interface Problem {
  id: number
  title: string
  description: string
  inputFormat: string
  outputFormat: string
  constraints: string
  points: number
}

interface Submission {
  id: number
  status: string
  verdict: string
  output: string
  error: string
  submittedAt: string
}

interface CodeReview {
  id: number
  feedback: string
  suggestions: string
  highlights: string
  qualityScore: number
}

export default function ProblemPage() {
  const params = useParams()
  const problemId = params.id as string
  const [problem, setProblems] = useState<Problem | null>(null)
  const [code, setCode] = useState(
    "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  )
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [codeReview, setCodeReview] = useState<CodeReview | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    fetchProblem()
  }, [problemId])

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8080/ws-submissions")

    websocket.onopen = () => {
      console.log("WebSocket connected")
      setWs(websocket)
    }

    websocket.onmessage = (event) => {
      try {
        const submission = JSON.parse(event.data)
        setSubmissions((prev) => prev.map((s) => (s.id === submission.id ? submission : s)))
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error)
      }
    }

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close()
      }
    }
  }, [])

  const fetchProblem = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/problems/${problemId}`)
      const data = await response.json()
      setProblems(data)
    } catch (error) {
      console.error("Failed to fetch problem:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const response = await fetch("http://localhost:8080/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          problemId: Number.parseInt(problemId),
          contestId: problem?.id,
          code,
          language: "JAVA",
        }),
      })

      const submission = await response.json()
      setSubmissions([submission, ...submissions])
    } catch (error) {
      console.error("Failed to submit:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestReview = async (submissionId: number) => {
    setReviewLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/code-mentor/review/${submissionId}`, {
        method: "POST",
      })
      const review = await response.json()
      setCodeReview(review)
    } catch (error) {
      console.error("Failed to get code review:", error)
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-50">{problem?.title}</h1>
        <p className="text-slate-400 text-sm mt-1">Points: {problem?.points}</p>
      </header>

      <div className="flex-1 flex gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Problem Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/3 bg-slate-800/50 border border-slate-700 rounded-lg p-6 overflow-y-auto"
        >
          <h2 className="text-lg font-bold text-slate-50 mb-4">Description</h2>
          <p className="text-slate-300 mb-6">{problem?.description}</p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">Input Format</h3>
              <p className="text-slate-400 text-sm">{problem?.inputFormat}</p>
            </div>
            <div>
              <h3 className="font-semibold text-cyan-400 mb-2">Output Format</h3>
              <p className="text-slate-400 text-sm">{problem?.outputFormat}</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Constraints</h3>
              <p className="text-slate-400 text-sm">{problem?.constraints}</p>
            </div>
          </div>
        </motion.div>

        {/* Editor and Submissions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-2/3 flex flex-col gap-4"
        >
          {/* Editor */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex-1">
            <Editor
              height="100%"
              defaultLanguage="java"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Geist Mono",
              }}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {submitting ? "Submitting..." : "Submit Code"}
          </motion.button>

          {/* Submissions */}
          {submissions.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-48 overflow-y-auto">
              <h3 className="font-bold text-slate-50 mb-3">Recent Submissions</h3>
              <div className="space-y-2">
                {submissions.map((submission) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded border cursor-pointer transition ${
                      selectedSubmission?.id === submission.id
                        ? "bg-purple-500/20 border-purple-500/50"
                        : submission.verdict === "ACCEPTED"
                          ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50"
                          : submission.verdict === "WRONG_ANSWER"
                            ? "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                            : submission.status === "JUDGING"
                              ? "bg-blue-500/10 border-blue-500/30"
                              : "bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50"
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300 font-semibold">
                        {submission.verdict || submission.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(submission.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Code Review Section */}
          {selectedSubmission && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-50">AI Code Mentor</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRequestReview(selectedSubmission.id)}
                  disabled={reviewLoading}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-semibold py-2 px-4 rounded transition"
                >
                  {reviewLoading ? "Analyzing..." : "Get AI Review"}
                </motion.button>
              </div>

              {codeReview ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-purple-400 font-semibold mb-1">Feedback</p>
                    <p className="text-slate-300">{codeReview.feedback}</p>
                  </div>
                  <div>
                    <p className="text-cyan-400 font-semibold mb-1">Suggestions</p>
                    <ul className="text-slate-300 space-y-1">
                      {codeReview.suggestions.split("|").map((suggestion, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-cyan-400">•</span>
                          <span>{suggestion.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold mb-1">Highlights</p>
                    <ul className="text-slate-300 space-y-1">
                      {codeReview.highlights.split("|").map((highlight, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{highlight.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Quality Score:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < codeReview.qualityScore
                              ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                              : "bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-300 font-semibold">{codeReview.qualityScore}/10</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm">
                  Click "Get AI Review" to receive personalized feedback on your code
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
