import React from 'react'
import { Link } from 'react-router-dom'
export default function ArticleCard({a}){
  return (
    <article className="p-4 bg-slate-800/40 rounded-md flex gap-4">
      <div className="w-28 h-20 bg-slate-700 rounded-md flex items-center justify-center text-slate-300">{a.topic}</div>
      <div className="flex-1">
        <Link to={`/article/${a.id}`} className="font-semibold text-lg">{a.title}</Link>
        <p className="text-sm text-slate-400 mt-1">{a.excerpt}</p>
      </div>
    </article>
  )
}
