import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Article from './pages/Article'
import Admin from './pages/Admin'
import Header from './components/Header'

export default function App(){
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/article/:id" element={<Article/>} />
          <Route path="/admin/*" element={<Admin/>} />
        </Routes>
      </main>
    </div>
  )
}
