'use client'

import { useEffect, useState } from 'react'

interface Engine {
  id: number
  name: string
  horsepower: number
  torque: number
}

export default function ChipTuningCalculator() {
  const [makes, setMakes] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [engines, setEngines] = useState<Engine[]>([])

  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [selectedEngine, setSelectedEngine] = useState<Engine | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/makes')
      .then(res => res.json())
      .then(json => {
        const list = (json.data as any[])
          .map(item => item.name as string)
          .sort()
        setMakes(list)
      })
      .catch(() => setError('Failed to load makes'))
      .finally(() => setLoading(false))
  }, [])

  const fetchModels = (make: string) => {
    setLoading(true)
    fetch(`/api/models?make=${encodeURIComponent(make)}`)
      .then(res => res.json())
      .then(json => {
        const list = (json.data as string[]).sort()
        setModels(list)
      })
      .catch(() => setError('Failed to load models'))
      .finally(() => setLoading(false))
  }

  const fetchEngines = (make: string, model: string) => {
    setLoading(true)
    fetch(
      `/api/engines?make=${encodeURIComponent(make)}&model=${encodeURIComponent(
        model
      )}`
    )
      .then(res => res.json())
      .then(json => {
        const list = (json.data as any[]).map(e => ({
          id: e.id,
          name: e.name,
          horsepower: e.horsepower,
          torque: e.torque,
        })) as Engine[]
        setEngines(list)
      })
      .catch(() => setError('Failed to load engines'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (make && model) {
      fetchEngines(make, model)
    }
  }, [make, model])

  const hp = selectedEngine?.horsepower ?? 0
  const tq = selectedEngine?.torque ?? 0
  const hpGainPct = 19
  const tqGainPct = 17
  const tunedHp = Math.round(hp * (1 + hpGainPct / 100))
  const tunedTq = Math.round(tq * (1 + tqGainPct / 100))

  const handleSubmit = () => {
    if (!selectedEngine) {
      setError('Please select a valid engine')
      return
    }
    setError('')
  }

  return (
    <section id="tuning" className="bg-[#111111] text-white px-6 py-20">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-center">
        Chip Tuning Calculator
      </h2>
      <p className="text-gray-400 mb-12 text-center text-lg max-w-xl mx-auto">
        Estimate your car’s performance potential with a chip tune
      </p>

      <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6 max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm block mb-1">Car Brand</label>
            <select
              value={make}
              disabled={loading}
              onChange={e => {
                setMake(e.target.value)
                fetchModels(e.target.value)
              }}
              className="w-full bg-[#111111] border border-gray-600 text-white px-3 py-2 rounded-md"
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
            <label className="text-sm block mb-1">Car Model</label>
            <select
              value={model}
              disabled={loading}
              onChange={e => {
                setModel(e.target.value)
                fetchEngines(make, e.target.value)
              }}
              className="w-full bg-[#111111] border border-gray-600 text-white px-3 py-2 rounded-md"
            >
              <option value="">-- Select Model --</option>
              {models.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Engine */}
          <div>
            <label className="text-sm block mb-1">Engine / Trim</label>
            <select
              value={selectedEngine?.id ?? ''}
              disabled={loading}
              onChange={e =>
                setSelectedEngine(
                  engines.find(en => en.id === +e.target.value) ?? null
                )
              }
              className="w-full bg-[#111111] border border-gray-600 text-white px-3 py-2 rounded-md"
            >
              <option value="">-- Select Engine --</option>
              {engines.map(en => (
                <option key={en.id} value={en.id}>
                  {en.name} – {en.horsepower} HP / {en.torque} Nm
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculate */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedEngine || loading}
            className="bg-yellow-400 text-black font-semibold py-2 px-6 rounded-md hover:bg-yellow-500 transition disabled:opacity-50"
          >
            Calculate Tuning Potential
          </button>
        </div>

        {/* Results */}
        {selectedEngine && !error && (
          <div className="bg-[#191919] rounded-xl p-6 border border-gray-700 space-y-4">
            <h3 className="text-xl font-semibold mb-2">Tuning Potential Results</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-sm">Stock Performance</p>
                <p className="text-2xl font-bold">
                  {hp} <span className="text-sm">HP</span>
                </p>
                <p className="text-2xl font-bold">
                  {tq} <span className="text-sm">Nm</span>
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">After Chip Tuning</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {tunedHp} <span className="text-sm text-white">HP</span>
                </p>
                <p className="text-2xl font-bold text-yellow-400">
                  {tunedTq} <span className="text-sm text-white">Nm</span>
                </p>
              </div>
            </div>

            <div className="text-sm mt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Horsepower</span>
                <span className="text-yellow-400 font-medium">+{hpGainPct}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{ width: `${hpGainPct}%` }}
                />
              </div>

              <div className="flex justify-between text-gray-300">
                <span>Torque</span>
                <span className="text-yellow-400 font-medium">+{tqGainPct}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{ width: `${tqGainPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </section>
  )
}
