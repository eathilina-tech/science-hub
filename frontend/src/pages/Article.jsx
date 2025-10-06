import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
export default function Article(){
  const {id} = useParams()
  const [a, setA] = useState(null)
  useEffect(()=>{ if(id) load() },[id])
  async function load(){
    try{
      const base = import.meta.env.VITE_API_URL || ''
      const res = await axios.get((base||'') + '/api/articles/' + id)
      setA(res.data)
    }catch(err){
      const sample = (window.__SAMPLE_ARTICLES||[]).find(x=>String(x.id)===String(id))
      setA(sample)
    }
  }
  if(!a) return <div>Loading...</div>
  return (
    <article>
      <h1 className="text-2xl font-bold">{a.title}</h1>
      <div className="text-sm text-slate-400 mb-4">Topic: {a.topic}</div>
      <div className="prose" dangerouslySetInnerHTML={{__html: a.content}} />
    </article>
  )
}
