import React, {useEffect, useState} from 'react'
import axios from 'axios'

function Editor({onSaved}){
  const [title,setTitle] = useState('')
  const [topic,setTopic] = useState('Physics')
  const [content,setContent] = useState('')
  async function save(){
    const token = localStorage.getItem('sh_token')
    await axios.post((import.meta.env.VITE_API_URL||'') + '/api/admin/articles',{title,topic,excerpt:content.slice(0,200),content},{headers:{Authorization:`Bearer ${token}`}})
    setTitle(''); setTopic(''); setContent('')
    onSaved && onSaved()
    alert('Saved')
  }
  return (
    <div className="space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 rounded-md bg-slate-700/40" />
      <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic" className="w-full p-2 rounded-md bg-slate-700/40" />
      <textarea value={content} onChange={e=>setContent(e.target.value)} rows={10} className="w-full p-2 rounded-md bg-slate-700/40" />
      <div><button onClick={save} className="px-3 py-2 bg-sky-400 text-slate-900 rounded-md">Save Article</button></div>
    </div>
  )
}

export default function Admin(){
  const [auth, setAuth] = useState(localStorage.getItem('sh_token'))
  const [articles, setArticles] = useState([])

  useEffect(()=>{ if(auth) load() },[auth])
  async function load(){
    try{
      const res = await axios.get((import.meta.env.VITE_API_URL||'') + '/api/admin/articles', {headers:{Authorization:`Bearer ${auth}`}})
      setArticles(res.data)
    }catch(e){}
  }

  if(!auth) return (
    <div className="max-w-md">
      <h2 className="text-xl font-semibold">Admin login</h2>
      <button onClick={async()=>{try{const res = await axios.post((import.meta.env.VITE_API_URL||'') + '/api/admin/login',{username:'admin',password:'password'}); localStorage.setItem('sh_token', res.data.token); setAuth(res.data.token)}catch(e){alert('Demo: try running backend locally')}}} className="mt-3 px-3 py-2 bg-emerald-400 rounded-md text-slate-900">Login (demo)</button>
    </div>
  )

  return (
    <div>
      <h2 className="text-xl font-semibold">Admin</h2>
      <div className="mt-3">
        <Editor onSaved={load} />
      </div>
      <div className="mt-6">
        <h3 className="font-semibold">Existing articles</h3>
        <ul className="mt-2 space-y-2">
          {articles.map(a=> <li key={a.id} className="p-2 bg-slate-800/30 rounded-md">{a.title}</li>)}
        </ul>
      </div>
    </div>
  )
}
