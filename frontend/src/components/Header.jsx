import React from 'react'
import { Link } from 'react-router-dom'
export default function Header(){
  return (
    <header className="bg-slate-800/60 sticky top-0 z-30">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-300 to-sky-400 rounded-md flex items-center justify-center font-bold text-slate-900">SH</div>
          <div>
            <Link to="/" className="font-semibold">ScienceHub</Link>
            <div className="text-sm text-slate-400">Clear explainers & diagrams</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-300 hover:text-white">Home</Link>
          <Link to="/admin" className="text-slate-300 hover:text-white">Admin</Link>
        </div>
      </div>
    </header>
  )
}
