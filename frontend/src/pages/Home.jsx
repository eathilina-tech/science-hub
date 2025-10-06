import React, {useEffect, useState} from 'react'
import axios from 'axios'
import ArticleCard from '../components/ArticleCard'

export default function Home(){
  const [articles, setArticles] = useState([])
  const [q, setQ] = useState('')

  useEffect(()=>{ fetchArticles() },[])

  async function fetchArticles(){
    try{
      const base = import.meta.env.VITE_API_URL || ''
      const res = await axios.get((base||'') + '/api/articles')
      setArticles(res.data)
    }catch(err){
      setArticles(window.__SAMPLE_ARTICLES || [])
    }
  }

  const filtered = articles.filter(a=> (a.title + a.excerpt + a.topic).toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search articles..." className="flex-1 p-2 rounded-md bg-slate-700/40" />
        <input type="email" id="email-sub" placeholder="you@example.com" className="p-2 rounded-md bg-slate-700/40" />
        <button onClick={async()=>{const email=document.getElementById('email-sub').value; try{ await axios.post((import.meta.env.VITE_API_URL||'') + '/api/subscribe',{email}); alert('Subscribed (demo)') }catch(e){ alert('Subscribed (demo)') }}} className="px-3 py-2 bg-emerald-400 rounded-md text-slate-900">Subscribe</button>
      </div>

      <div className="grid gap-3">
        {filtered.map(a=> <ArticleCard key={a.id} a={a}/>)}
      </div>
    </div>
  )
}
