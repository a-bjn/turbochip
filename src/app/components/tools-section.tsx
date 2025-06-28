'use client'

import { FaBolt, FaSearch, FaTools } from 'react-icons/fa'

export default function ToolsSection() {
  return (
    <section
      id="tools"
      className="bg-[#111111] text-white px-6 sm:px-20 py-20 flex flex-col items-center"
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Our Powerful Tools</h2>
      <p className="text-gray-400 text-center mb-12 text-lg max-w-xl">
        Designed to enhance your automotive experience
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Common Engine Problems Card */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition">
          <div className="bg-yellow-400 p-3 rounded-md w-fit mb-4 text-black">
            <FaTools size={20} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Common Engine Problems</h3>
          <p className="text-gray-400 mb-4">
            Explore a list of frequent engine issues, their causes, and how to troubleshoot them.
          </p>
          <a href="#common-problems" className="text-yellow-400 font-medium hover:underline">
            Learn more →
          </a>
        </div>
        {/* Chip Tuning Card */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition">
          <div className="bg-yellow-400 p-3 rounded-md w-fit mb-4 text-black">
            <FaBolt size={20} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Chip Tuning Calculator</h3>
          <p>
            Discover the hidden potential of your engine with our advanced chip tuning calculator.
            Get accurate estimates based on your car&apos;s specifications.
          </p>
          <a href="#tuning" className="text-yellow-400 font-medium hover:underline">
            Try it now →
          </a>
        </div>
        {/* AI Problem Solver Card */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl border border-gray-700 hover:border-yellow-500 transition">
          <div className="bg-yellow-400 p-3 rounded-md w-fit mb-4 text-black">
            <FaSearch size={20} />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Problem Solver</h3>
          <p className="text-gray-400 mb-4">
  {"Describe your car's symptoms and our AI will diagnose potential issues and provide solutions. Save time and money on unnecessary repairs."}
</p>
          <a href="#diagnostics" className="text-yellow-400 font-medium hover:underline">
            Search now →
          </a>
        </div>
      </div>
    </section>
  )
}
