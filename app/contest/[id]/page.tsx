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
}

interface Contest {
  id: number
  title: string
  description: string
  status: string
  startTime: string
  endTime: string
  totalProblems: number
  totalParticipants: number
}

export default function ContestDetailPage() {
  const params = useParams()
  const contestId = params.id as string
  const [contest, setContest] = useState<Contest | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    fetchContestData()
    checkJoinStatus()
  }, [contestId])

  const checkJoinStatus = async () => {
    try {
      const user = localStorage.getItem("user")
      if (!user) return

      const userData = JSON.parse(user)
      const response = await fetch(`/api/contest/${contestId}/check-joined`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.id }),
      })

      if (response.ok) {
        const data = await response.json()
        setHasJoined(data.hasJoined)
      }
    } catch (err) {
      console.error("[v0] Error checking join status:", err)
    }
  }

  const handleJoinContest = async () => {
    try {
      setJoining(true)
      const user = localStorage.getItem("user")
      if (!user) {
        setError("Please login to join a contest")
        return
      }

      const userData = JSON.parse(user)
      const response = await fetch(`/api/contest/${contestId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.id }),
      })

      if (response.ok) {
        setHasJoined(true)
        setError(null)
      } else {
        setError("Failed to join contest")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join contest")
    } finally {
      setJoining(false)
    }
  }

  const fetchContestData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch contest details
      const contestResponse = await fetch(`/api/contest/${contestId}`)
      if (!contestResponse.ok) throw new Error("Failed to fetch contest")
      const contestData = await contestResponse.json()
      setContest(contestData)

      // Fetch problems
      const problemsResponse = await fetch(`/api/contest/${contestId}/problems`)
      if (!problemsResponse.ok) throw new Error("Failed to fetch problems")
      const problemsData = await problemsResponse.json()
      setProblems(problemsData)
    } catch (err) {
      console.error("Error fetching contest data:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
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

  if (error && !contest) {
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
            {error || "Contest not found"}
          </div>
        </div>
      </main>
    )
  }

  if (!contest) return null

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/contests" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Contests
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            {contest.title}
          </h1>
          <p className="text-slate-400">{contest.description}</p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-slate-400 text-sm mb-2">Status</div>
            <div className={`text-2xl font-bold ${contest.status === "ONGOING" ? "text-green-400" : "text-slate-400"}`}>
              {contest.status}
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-slate-400 text-sm mb-2">Problems</div>
            <div className="text-2xl font-bold text-purple-400">{contest.totalProblems}</div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-slate-400 text-sm mb-2">Participants</div>
            <div className="text-2xl font-bold text-cyan-400">{contest.totalParticipants}</div>
          </motion.div>
        </div>

        <div className="flex gap-4 mb-8">
          {!hasJoined ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleJoinContest}
              disabled={joining}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {joining ? "Joining..." : "Join Contest"}
            </motion.button>
          ) : (
            <motion.div className="bg-green-500/20 border border-green-500/50 text-green-400 font-bold py-3 px-6 rounded-lg">
              ✓ Joined
            </motion.div>
          )}

          <Link href={`/contest/${contestId}/leaderboard`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              View Leaderboard
            </motion.button>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-50 mb-6">Problems</h2>
          {!hasJoined ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400 mb-4">Join the contest to view and solve problems</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleJoinContest}
                disabled={joining}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                {joining ? "Joining..." : "Join Contest"}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-4">
              {problems.length > 0 ? (
                problems.map((problem) => (
                  <Link key={problem.id} href={`/problem/${problem.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-50 mb-2">{problem.title}</h3>
                          <p className="text-slate-400 text-sm mb-4">{problem.description}</p>
                          <div className="flex gap-4 text-sm text-slate-400">
                            <span>Time: {problem.timeLimit}s</span>
                            <span>Memory: {problem.memoryLimit}MB</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${
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
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">No problems available</div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
