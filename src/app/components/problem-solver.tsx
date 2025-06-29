// File: src/components/ProblemSolver.tsx
'use client'

import { useState, FormEvent } from 'react'
import {
  FaSearch,
  FaExclamationTriangle,
  FaPlus,
  FaCheck,
} from 'react-icons/fa'

interface Diagnosis {
  title: string
  urgency: 'Low' | 'Medium' | 'High'
  description: string
  causes: string[]
  solutions: string[]
}

export default function ProblemSolver() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Diagnosis | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setError('')
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong')
      setResult(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="diagnostics"
      className="bg-[#111111] text-white px-6 sm:px-20 py-20"
    >
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
        AI Car Problem Solver
      </h2>
      <p className="text-gray-400 text-center mb-8">
        Describe your car’s symptoms and get instant solutions
      </p>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="flex max-w-3xl mx-auto overflow-hidden rounded-lg"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. rattling noises from engine"
          className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-400 px-4 flex items-center justify-center"
        >
          <FaSearch className="text-black" size={20} />
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* Result Card */}
      {result && (
        <div className="mt-12 max-w-4xl mx-auto bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="bg-yellow-400 px-6 py-3">
            <h3 className="text-xl font-semibold">{result.title}</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Urgency */}
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              <span className="font-medium">Urgency:</span>
              <span
                className={
                  result.urgency === 'High'
                    ? 'text-red-400'
                    : result.urgency === 'Medium'
                    ? 'text-yellow-300'
                    : 'text-green-400'
                }
              >
                {result.urgency}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300">{result.description}</p>

            {/* Causes & Solutions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Causes */}
              <div>
                <h4 className="text-white font-medium mb-2">
                  Possible Causes
                </h4>
                <ul className="space-y-1">
                  {result.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaPlus className="text-yellow-400 mt-1" />
                      <span className="text-gray-200">{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <h4 className="text-white font-medium mb-2">
                  Recommended Solutions
                </h4>
                <ul className="space-y-1">
                  {result.solutions.map((sol, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FaCheck className="text-green-400 mt-1" />
                      <span className="text-gray-200">{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
