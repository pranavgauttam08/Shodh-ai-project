"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

interface LeaderboardEntry {
  userId: number
  username: string
  totalScore: number
  problemsSolved: number
  rank?: number
}

export default function ContestLeaderboardPage() {
  const params = useParams()
  const contestId = params.id as string
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const userRowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      setCurrentUserId(Number.parseInt(userId))
    }
    fetchLeaderboard()
  }, [contestId])

  useEffect(() => {
    if (userRowRef.current && !loading) {
      setTimeout(() => {
        userRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 100)
    }
  }, [loading, leaderboard])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/contest/${contestId}/leaderboard`)
      if (!response.ok) throw new Error("Failed to fetch leaderboard")

      const data = await response.json()
      // Add rank to each entry
      const rankedData = data.map((entry: LeaderboardEntry, index: number) => ({
        ...entry,
        rank: index + 1,
      }))
      setLeaderboard(rankedData)
    } catch (err) {
      console.error("Error fetching leaderboard:", err)
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

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href={`/contest/${contestId}`} className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Contest
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Contest Leaderboard
          </h1>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-red-400">{error}</div>
        ) : leaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 text-slate-400 font-semibold">Rank</th>
                  <th className="text-left py-4 px-6 text-slate-400 font-semibold">Name</th>
                  <th className="text-center py-4 px-6 text-slate-400 font-semibold">Problems Solved</th>
                  <th className="text-right py-4 px-6 text-slate-400 font-semibold">Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const isCurrentUser = entry.userId === currentUserId
                  return (
                    <motion.tr
                      key={entry.userId}
                      ref={isCurrentUser ? userRowRef : null}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-slate-800 transition ${
                        isCurrentUser ? "bg-purple-500/20 hover:bg-purple-500/30" : "hover:bg-slate-800/30"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              entry.rank === 1
                                ? "bg-yellow-500/20 text-yellow-400"
                                : entry.rank === 2
                                  ? "bg-gray-400/20 text-gray-300"
                                  : entry.rank === 3
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {entry.rank}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-50 font-medium">{entry.username}</span>
                          {isCurrentUser && (
                            <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">You</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center text-purple-400 font-semibold">{entry.problemsSolved}</td>
                      <td className="py-4 px-6 text-right">
                        <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent font-bold text-lg">
                          {entry.totalScore}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">No submissions yet</div>
        )}
      </section>
    </main>
  )
}
