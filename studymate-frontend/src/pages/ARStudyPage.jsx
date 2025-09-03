import React, { useMemo, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { Camera, Search, Filter, Box, Cpu, CircuitBoard, Atom, X } from 'lucide-react'

const SUBJECTS = ['All', 'Data Structures', 'Algorithms', 'Electronics', 'Mechanical', 'Physics', 'Biology']

const SAMPLE_RESOURCES = [
  { id: 'r1', title: 'Binary Tree (3D)', subject: 'Data Structures', difficulty: 'Beginner', thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop', desc: 'Visualize node relationships and traversal in 3D.' },
  { id: 'r2', title: 'Sorting Algorithm Flow', subject: 'Algorithms', difficulty: 'Intermediate', thumb: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop', desc: 'See step-by-step animations of sorting logic.' },
  { id: 'r3', title: 'RLC Circuit', subject: 'Electronics', difficulty: 'Intermediate', thumb: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop', desc: 'Interact with components and observe resonance.' },
  { id: 'r4', title: 'Four-stroke Engine', subject: 'Mechanical', difficulty: 'Advanced', thumb: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop', desc: 'Understand engine cycles with AR overlays.' },
  { id: 'r5', title: 'Atomic Structure', subject: 'Physics', difficulty: 'Beginner', thumb: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?q=80&w=800&auto=format&fit=crop', desc: 'Explore electron shells and orbitals.' },
]

const ARStudyPage = () => {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('All')
  const [active, setActive] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SAMPLE_RESOURCES.filter(r =>
      (subject === 'All' || r.subject === subject) &&
      (!q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q))
    )
  }, [query, subject])

  return (
    <PageLayout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl backdrop-blur flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AR Study</h1>
                <p className="text-white/70 text-sm">Explore interactive 3D/AR visualizations for BTech subjects.</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
                <Search className="w-5 h-5 text-white/70" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search resources..." className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
                <Filter className="w-5 h-5 text-white/70" />
                <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-1 bg-transparent text-white outline-none">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => (
              <div key={r.id} className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition">
                <div className="aspect-video bg-black/20 overflow-hidden">
                  <img src={r.thumb} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold truncate">{r.title}</div>
                    <span className="text-xs text-white/70">{r.difficulty}</span>
                  </div>
                  <div className="text-white/70 text-sm line-clamp-2">{r.desc}</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs">{r.subject}</span>
                    <button onClick={() => setActive(r)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm">
                      <Box className="w-4 h-4" /> View in AR
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-white/70">No resources found. Try adjusting your filters.</div>
            )}
          </div>
        </div>

        {/* AR Modal Placeholder */}
        {active && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setActive(null)} />
            <div className="relative w-[94%] max-w-4xl bg-slate-900 text-white rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <Box className="w-5 h-5" />
                  <span className="font-semibold">{active.title}</span>
                </div>
                <button onClick={() => setActive(null)} className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <div className="aspect-video rounded-xl bg-black/30 border border-white/10 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <div className="mb-2 flex items-center justify-center gap-2"><Cpu className="w-5 h-5" /> <CircuitBoard className="w-5 h-5" /> <Atom className="w-5 h-5" /></div>
                      <div className="font-medium">AR Viewer Placeholder</div>
                      <div className="text-xs">Integrate WebXR/SceneViewer/Model-Viewer here.</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/60">Subject</div>
                    <div className="text-white font-medium">{active.subject}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Difficulty</div>
                    <div className="text-white font-medium">{active.difficulty}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Description</div>
                    <div className="text-white/80">{active.desc}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default ARStudyPage
