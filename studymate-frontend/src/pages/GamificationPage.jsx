import React, { useEffect, useMemo, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { Trophy, Star, Medal, Target, CheckCircle2, Swords, Flame } from 'lucide-react'

const STORE_KEY = 'studymate_gamification'

const SAMPLE_BADGES = [
  { id: 'b1', name: 'First Upload', desc: 'Uploaded your first document', icon: Star },
  { id: 'b2', name: 'Note Taker', desc: 'Generated study notes', icon: NotebookIcon },
  { id: 'b3', name: 'Streak 3', desc: '3-day study streak', icon: Flame },
]

function NotebookIcon(props){return(<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M8 6h12v14H8z"/></svg>)}

const SAMPLE_QUESTS = [
  { id: 'q1', title: 'Upload 2 documents', points: 50 },
  { id: 'q2', title: 'Study 30 minutes', points: 30 },
  { id: 'q3', title: 'Generate notes once', points: 20 },
]

const LEADERBOARD = [
  { name: 'Ananya', points: 520 },
  { name: 'Rahul', points: 480 },
  { name: 'You', points: 440 },
  { name: 'Priya', points: 420 },
]

const GamificationPage = () => {
  const [points, setPoints] = useState(420)
  const [completed, setCompleted] = useState({})

  useEffect(()=>{
    try{const raw = localStorage.getItem(STORE_KEY); if(raw){ const s = JSON.parse(raw); setPoints(s.points ?? 420); setCompleted(s.completed ?? {}) }}catch{}
  },[])
  useEffect(()=>{ try{ localStorage.setItem(STORE_KEY, JSON.stringify({ points, completed })) }catch{} },[points,completed])

  const level = useMemo(() => Math.floor(points/100)+1, [points])
  const progress = useMemo(() => points % 100, [points])

  const toggleQuest = (q) => {
    setCompleted(prev => {
      const next = { ...prev, [q.id]: !prev[q.id] }
      if(!prev[q.id]) setPoints(p=>p+q.points)
      else setPoints(p=>p-q.points)
      return next
    })
  }

  return (
    <PageLayout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl backdrop-blur flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Gamification</h1>
              <p className="text-white/70 text-sm">Earn points, unlock badges, and climb the leaderboard.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Stats */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/10 border border-white/20 p-4 text-white">
                  <div className="text-sm text-white/70">Points</div>
                  <div className="text-2xl font-bold">{points}</div>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-4 text-white">
                  <div className="text-sm text-white/70">Level</div>
                  <div className="text-2xl font-bold">{level}</div>
                </div>
                <div className="rounded-xl bg-white/10 border border-white/20 p-4 text-white">
                  <div className="text-sm text-white/70">Progress</div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full" style={{width: `${progress}%`}} />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-5">
                <div className="text-white font-semibold mb-2 inline-flex items-center gap-2"><Medal className="w-5 h-5"/> Badges</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {SAMPLE_BADGES.map(b => (
                    <div key={b.id} className="rounded-xl bg-white/10 border border-white/20 p-4 text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                        <b.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">{b.name}</div>
                        <div className="text-xs text-white/70">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
              <div className="text-white font-semibold mb-3 inline-flex items-center gap-2"><Swords className="w-5 h-5"/> Leaderboard</div>
              <div className="space-y-2">
                {LEADERBOARD.map((u,i)=> (
                  <div key={u.name} className="flex items-center justify-between rounded-xl bg-white/10 border border-white/20 p-3 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">{i+1}</div>
                      <div className="font-medium">{u.name}</div>
                    </div>
                    <div className="text-white/80">{u.points} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quests */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
            <div className="text-white font-semibold mb-3 inline-flex items-center gap-2"><Target className="w-5 h-5"/> Daily Quests</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_QUESTS.map(q => (
                <button key={q.id} onClick={()=>toggleQuest(q)} className={`text-left rounded-xl border p-4 ${completed[q.id]?'bg-green-500/20 border-green-400/40 text-white':'bg-white/10 border-white/20 text-white'} hover:bg-white/20`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{q.title}</div>
                    {completed[q.id] ? <CheckCircle2 className="w-5 h-5"/> : <span className="text-white/80 text-sm">+{q.points}</span>}
                  </div>
                  <div className="text-xs text-white/70">Tap to {completed[q.id]?'undo':'complete'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default GamificationPage
