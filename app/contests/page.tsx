"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface Contest {
  id: number
  title: string
  description: string
  status: string
  totalProblems: number
  totalParticipants: number
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      const response = await fetch("/api/contests")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setContests(data)
    } catch (error) {
      console.error("Failed to fetch contests:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back Home
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            All Contests
          </h1>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contests.map((contest) => (
              <Link key={contest.id} href={`/contest/${contest.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-slate-50 mb-2">{contest.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{contest.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span>{contest.totalProblems} Problems</span>
                      <span>{contest.totalParticipants} Participants</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        contest.status === "ONGOING"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {contest.status}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
