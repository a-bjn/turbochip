'use client'

import { FaCarSide } from 'react-icons/fa'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800 bg-[#191919] text-gray-200 font-bold">
      <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg">
        <FaCarSide size={24} />
        TurboTech
      </div>
      <nav className="space-x-6 text-sm sm:text-base">
        <a href="#tuning" className="hover:text-yellow-400 transition">Chip Tuning</a>
        <a href="#diagnostics" className="hover:text-yellow-400 transition">Problem Solver</a>
        <a href="#about" className="hover:text-yellow-400 transition">About</a>
      </nav>
    </header>
  )
}
