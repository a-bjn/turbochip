'use client'

import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()

  return (
    <section className="flex flex-col items-center justify-center text-center px-6 sm:px-16 py-24 gap-6 bg-[#191919]">
      <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl leading-tight">
        Your Ultimate Car Tech Resource
      </h1>
      <p className="text-gray-400 text-lg max-w-xl">
        Optimize your engine performance and solve car problems with our advanced tools
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          className="bg-yellow-400 text-black font-medium py-3 px-6 rounded-md hover:bg-yellow-500 transition"
          onClick={() => router.push('#tuning')}
        >
          Calculate Tuning Potential
        </button>
        <button
          className="border border-yellow-500 text-yellow-400 font-medium py-3 px-6 rounded-md hover:bg-yellow-600 hover:text-black transition"
          onClick={() => router.push('#diagnostics')}
        >
          Troubleshoot Issues
        </button>
      </div>
    </section>
  )
}
