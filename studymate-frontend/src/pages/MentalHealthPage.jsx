import React, { useEffect, useMemo, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { Heart, Smile, Meh, Frown, Wind, NotebookPen, Sun, Moon, CalendarDays } from 'lucide-react'

const MOODS = [
  { key: 'great', icon: Smile, label: 'Great' },
  { key: 'okay', icon: Meh, label: 'Okay' },
  { key: 'down', icon: Frown, label: 'Down' },
]

const TIPS = [
  'Take a 5-minute walk and hydrate.',
  'Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s.',
  'Break tasks into 25-min focus sprints.',
  'Write down your top 3 priorities for today.',
  'Reach out to a friend or classmate for a quick chat.',
]

const MH_STORE = 'studymate_mental_health'

const MentalHealthPage = () => {
  const [entries, setEntries] = useState([])
  const [selectedMood, setSelectedMood] = useState('great')
  const [breathing, setBreathing] = useState(false)
  const [journal, setJournal] = useState('')

  useEffect(() => {
    try { const raw = localStorage.getItem(MH_STORE); setEntries(raw ? JSON.parse(raw) : []) } catch {}
  }, [])
  useEffect(() => { try { localStorage.setItem(MH_STORE, JSON.stringify(entries)) } catch {} }, [entries])

  const today = useMemo(() => new Date().toISOString().slice(0,10), [])

  const saveEntry = () => {
    setEntries(prev => [{ date: today, mood: selectedMood, note: journal.trim() }, ...prev])
    setJournal('')
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
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Wellness & Mindfulness</h1>
              <p className="text-white/70 text-sm">Track your mood, breathe, and journal to stay balanced.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Mood Tracker */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
              <div className="text-white font-semibold mb-3">How do you feel today?</div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {MOODS.map(m => (
                  <button key={m.key} onClick={()=>setSelectedMood(m.key)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border ${selectedMood===m.key?'bg-white/20 border-white/40':'bg-white/10 border-white/20'} text-white`}>
                    <m.icon className="w-5 h-5" /> {m.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <textarea value={journal} onChange={e=>setJournal(e.target.value)} rows={4} placeholder="Write a short journal entry..." className="w-full rounded-xl bg-white/10 border border-white/20 outline-none p-3 text-white" />
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-white/80 text-sm">
                  <div className="font-medium text-white mb-1">Today’s tip</div>
                  {TIPS[new Date().getDate() % TIPS.length]}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={saveEntry} className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white inline-flex items-center gap-2"><NotebookPen className="w-4 h-4"/> Save</button>
                <div className="text-white/60 text-sm inline-flex items-center gap-2"><CalendarDays className="w-4 h-4"/> {today}</div>
              </div>
            </div>

            {/* Breathing */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
              <div className="text-white font-semibold mb-3 inline-flex items-center gap-2"><Wind className="w-5 h-5"/> 1‑Minute Breathing</div>
              <div className="aspect-video rounded-xl bg-black/20 border border-white/10 flex items-center justify-center">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000 ${breathing?'scale-110':'scale-90'}`} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={()=>setBreathing(b=>!b)} className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white">{breathing?'Pause':'Start'}</button>
                <div className="text-white/70 text-sm">Inhale... Hold... Exhale... Hold...</div>
              </div>
            </div>
          </div>

          {/* History */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5">
            <div className="text-white font-semibold mb-3">Recent entries</div>
            {entries.length === 0 && <div className="text-white/70">No entries yet. Save your first mood above.</div>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {entries.slice(0,6).map((e,i)=>(
                <div key={i} className="rounded-xl bg-white/10 border border-white/20 p-3 text-white/80">
                  <div className="text-white font-medium mb-1 capitalize">{e.mood}</div>
                  <div className="text-xs mb-1">{e.date}</div>
                  <div className="text-sm line-clamp-3">{e.note || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default MentalHealthPage
