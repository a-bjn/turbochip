'use client'

import { useEffect, useState } from 'react'

interface CarMake {
  name: string
}

interface CarEngine {
  id: number
  name: string
}

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
  const [engineId, setEngineId] = useState<number | ''>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load makes on mount
  useEffect(() => {
    fetch('/api/makes')
      .then(r => r.json())
      .then(json => {
        const list = (json.data as CarMake[])
          .map(i => i.name)
          .sort()
        setMakes(list)
      })
      .catch(() => setError('Failed to load makes'))
  }, [])

  // Load models when make changes
  useEffect(() => {
    if (!make) {
      setModels([])
      setModel('')
      return
    }
    fetch(`/api/models?make=${encodeURIComponent(make)}`)
      .then(r => r.json())
      .then(json => {
        const list = (json.data as string[]).sort()
        setModels(list)
      })
      .catch(() => setError('Failed to load models'))
  }, [make])

  // Load engines when model changes
  useEffect(() => {
    if (!make || !model) {
      setEngines([])
      setEngineId('')
      return
    }
    fetch(
      `/api/engines?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`
    )
      .then(r => r.json())
      .then(json => {
        const list = (json.data as CarEngine[]).map(e => ({
          id: e.id,
          name: e.name,
        }))
        setEngines(list)
      })
      .catch(() => setError('Failed to load engines'))
  }, [make, model])

  // Fetch issues when user clicks button
  const fetchIssues = () => {
    if (!engineId) {
      setError('Please select an engine')
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
        engine: engines.find(e => e.id === engineId)?.name
      })
    })
      .then(r => r.json())
      .then(json => {
        if (json.error) throw new Error(json.error)
        setIssues(json.data as Issue[])
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  return (
    <section id="common-problems" className="bg-[#111111] text-white px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        Common Engine Problems
      </h2>
      <p className="text-gray-400 mb-12 text-center max-w-xl mx-auto">
        Select your car and engine to generate the most frequent issues.
      </p>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm block mb-1">Brand</label>
            <select
              value={make}
              onChange={e => setMake(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-600 px-3 py-2 rounded text-white"
            >
              <option value="">-- Select Brand --</option>
              {makes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

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
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm block mb-1">Engine / Trim</label>
            <select
              value={engineId}
              disabled={!model}
              onChange={e => setEngineId(+e.target.value || '')}
              className="w-full bg-[#1a1a1a] border border-gray-600 px-3 py-2 rounded text-white"
            >
              <option value="">-- Select Engine --</option>
              {engines.map(en => (
                <option key={en.id} value={en.id}>{en.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={fetchIssues}
            disabled={loading}
            className="bg-yellow-400 text-black px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Get Common Issues'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {issues.length > 0 && (
          <ul className="space-y-4">
            {issues.map(issue => (
              <li key={issue.id} className="bg-[#1a1a1a] p-4 rounded border border-gray-700">
                {issue.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
