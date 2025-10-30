"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

interface Problem {
  id: number
  title: string
  description: string
  points: number
  solvedCount: number
}

interface Contest {
  id: number
  title: string
  description: string
  status: string
}

export default function ContestPage() {
  const params = useParams()
  const contestId = params.id as string
  const [contest, setContest] = useState<Contest | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContestData()
  }, [contestId])

  const fetchContestData = async () => {
    try {
      const [contestRes, problemsRes] = await Promise.all([
        fetch(`http://localhost:8080/api/contests/${contestId}`),
        fetch(`http://localhost:8080/api/problems/contest/${contestId}`),
      ])

      const contestData = await contestRes.json()
      const problemsData = await problemsRes.json()

      setContest(contestData)
      setProblems(problemsData)
    } catch (error) {
      console.error("Failed to fetch contest data:", error)
    } finally {
      setLoading(false)
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
    <main className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Contests
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-50">{contest?.title}</h1>
              <p className="text-slate-400 mt-2">{contest?.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Problems Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-50">Problems</h2>
        <div className="space-y-4">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/problem/${problem.id}`}>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-50 group-hover:text-cyan-400 transition mb-2">
                        {problem.title}
                      </h3>
                      <p className="text-slate-400 text-sm">{problem.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-purple-400 mb-2">{problem.points}</div>
                      <div className="text-xs text-slate-400">{problem.solvedCount} solved</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
