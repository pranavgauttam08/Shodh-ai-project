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

export default function Home() {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/contests")
      const data = await response.json()
      setContests(data)
    } catch (error) {
      console.error("Failed to fetch contests:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Shodh-a-Code
            </h1>
          </motion.div>
          <nav className="flex gap-6">
            <Link href="/contests" className="text-slate-300 hover:text-purple-400 transition">
              Contests
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Competitive Programming Reimagined
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join coding contests, solve challenging problems, and compete with developers worldwide. Powered by AI
            mentorship.
          </p>
        </motion.div>

        {/* Contests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : contests.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400">No contests available</div>
          ) : (
            contests.map((contest, index) => (
              <motion.div
                key={contest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/contest/${contest.id}`}>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-50 group-hover:text-purple-400 transition">
                        {contest.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          contest.status === "ONGOING"
                            ? "bg-green-500/20 text-green-400"
                            : contest.status === "UPCOMING"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {contest.status}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{contest.description}</p>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span>📝 {contest.totalProblems} Problems</span>
                      <span>👥 {contest.totalParticipants} Participants</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
