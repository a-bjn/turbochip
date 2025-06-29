'use client'

import { useEffect, useState } from 'react'

interface Engine {
  id: number
  name: string
}

interface Issue {
  id: string
  description: string
}

export default function CommonIssues() {
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [engines, setEngines] = useState<Engine[]>([])
  const [issues, setIssues] = useState<Issue[]>([])

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [engineId, setEngineId] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1️⃣ Load makes on mount
  useEffect(() => {
    fetch('/api/makes')
      .then(res => res.json() as Promise<{ data: { name: string }[] }>)
      .then(json => {
        const list = json.data.map(i => i.name).sort()
        setMakes(list)
      })
      .catch(err => {
        setError(`Failed to load makes: ${err instanceof Error ? err.message : err}`)
      })
  }, [])

  // 2️⃣ Load models when `make` changes
  useEffect(() => {
    if (!make) {
      setModels([])
      setModel('')
      return
    }

    fetch(`/api/models?make=${encodeURIComponent(make)}`)
      .then(res => res.json() as Promise<{ data: string[] }>)
      .then(json => {
        const list = json.data.sort()
        setModels(list)
      })
      .catch(err => {
        setError(`Failed to load models: ${err instanceof Error ? err.message : err}`)
      })
  }, [make])

  // 3️⃣ Load engines when `make`, `model`, or `year` changes
  useEffect(() => {
    if (!make || !model || !year) {
      setEngines([])
      setEngineId('')
      return
    }

    fetch(
      `/api/engines?make=${encodeURIComponent(make)}&model=${encodeURIComponent(
        model
      )}&year=${encodeURIComponent(year)}`
    )
      .then(
        res =>
          res.json() as Promise<{
            data: { id: number; name: string }[]
          }>
      )
      .then(json => {
        const list: Engine[] = json.data.map(e => ({
          id: e.id,
          name: e.name,
        }))
        setEngines(list)
      })
      .catch(err => {
        setError(`Failed to load engines: ${err instanceof Error ? err.message : err}`)
      })
  }, [make, model, year])

  // 4️⃣ Ask AI for common issues
  const fetchIssues = () => {
    if (!engineId || !year) {
      setError('Please select both Year and Engine')
      return
    }
    setError('')
    setLoading(true)
    setIssues([])

    fetch('/api/common-issues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        make,
        model,
        year,
        engine: engines.find(e => e.id === engineId)!.name,
      }),
    })
      .then(res =>
        res.json() as Promise<{ data: Issue[]; error?: string }>
      )
      .then(json => {
        if (json.error) throw new Error(json.error)
        setIssues(json.data)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <section id="common-problems" className="bg-[#111111] text-white px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        Common Engine Problems
      </h2>
      <p className="text-gray-400 mb-12 text-center max-w-xl mx-auto">
        Select your car, year, and engine to generate the most frequent issues.
      </p>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Brand */}
          <div>
            <label className="text-sm block mb-1">Brand</label>
            <select
              value={make}
              onChange={e => setMake(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-600 px-3 py-2 rounded text-white"
            >
              <option value="">-- Select Brand --</option>
              {makes.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="text-sm block mb-1">Model</label>
            <select
              value={model}
              disabled={!make}
              onChange={e => setModel(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-600 px-3 py-2 rounded text-white"
            >
              <option value="">-- Select Model --</option>
              {models.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-sm block mb-1">Year</label>
            <input
              type="number"
              value={year}
              disabled={!model}
              onChange={e => setYear(e.target.value)}
              placeholder="e.g. 2020"
              className="w-full bg-[#1a1a1a] border border-gray-600 px-3 py-2 rounded text-white"
            />
          </div>

          {/* Engine */}
          <div>
            <label className="text-sm block mb-1">Engine / Trim</label>
            <select
              value={engineId}
              disabled={!year}
              onChange={e => setEngineId(+e.target.value || '')}
              className="w-full bg-[#1a1a1a] border border-gray-600 px-3 py-2 rounded text-white"
            >
              <option value="">-- Select Engine --</option>
              {engines.map(en => (
                <option key={en.id} value={en.id}>
                  {en.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fetch */}
        <div className="text-center">
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="bg-yellow-400 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Get Common Issues'}
          </button>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Results */}
        {issues.length > 0 && (
          <ul className="space-y-4">
            {issues.map(issue => (
              <li
                key={issue.id}
                className="bg-[#1a1a1a] p-4 rounded border border-gray-700"
              >
                {issue.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
