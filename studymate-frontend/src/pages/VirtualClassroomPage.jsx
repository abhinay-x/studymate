import React, { useMemo, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { Video, CalendarPlus, Users, MessageSquare, Search, Plus, Copy, Clock, CalendarDays, Send, Shield, Eye, Lock } from 'lucide-react'

const SAMPLE_SESSIONS = [
  { id: 's1', title: 'DSA Doubt Solving', subject: 'Data Structures', date: '2025-09-05', time: '18:00', host: 'Prof. Sharma', code: 'DSA-8421', attendees: 24 },
  { id: 's2', title: 'OS Deadlocks', subject: 'Operating Systems', date: '2025-09-06', time: '20:00', host: 'Ananya', code: 'OS-5573', attendees: 12 },
]

const VirtualClassroomPage = () => {
  const [query, setQuery] = useState('')
  const [sessions, setSessions] = useState(SAMPLE_SESSIONS)
  const [form, setForm] = useState({ title: '', subject: '', date: '', time: '' })
  // Chat state
  const [messages, setMessages] = useState([
    { id: 1, role: 'Teacher', audience: 'All', text: 'Welcome to the DSA session!', time: '18:00' },
  ])
  const [myRole, setMyRole] = useState('Student') // Teacher | TA | Student
  const [viewFilter, setViewFilter] = useState('All') // All | Teacher | TA | Student
  const [audience, setAudience] = useState('All') // All | Teacher | TA | Student
  const [input, setInput] = useState('')
  const [muteStudents, setMuteStudents] = useState(false) // only Teacher can toggle
  const visibleMessages = useMemo(() => {
    return messages.filter(m =>
      (viewFilter === 'All' || m.role === viewFilter) &&
      (m.audience === 'All' || m.audience === myRole || myRole === 'Teacher')
    )
  }, [messages, viewFilter, myRole])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sessions.filter(s => !q || s.title.toLowerCase().includes(q) || s.subject.toLowerCase().includes(q))
  }, [query, sessions])

  const createSession = (e) => {
    e.preventDefault()
    if (!form.title || !form.subject || !form.date || !form.time) return
    const code = `${form.subject.slice(0,2).toUpperCase()}-${Math.floor(1000+Math.random()*9000)}`
    setSessions(prev => [{ id: code, title: form.title, subject: form.subject, date: form.date, time: form.time, host: 'You', code, attendees: 1 }, ...prev])
    setForm({ title: '', subject: '', date: '', time: '' })
  }

  const copyCode = async (code) => {
    try { await navigator.clipboard.writeText(code) } catch {}
  }

  const canSend = () => {
    if (myRole === 'Student' && muteStudents) return false
    return input.trim().length > 0
  }

  const nowTime = () => new Date().toTimeString().slice(0,5)

  const sendMessage = (e) => {
    e && e.preventDefault()
    if (!canSend()) return
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: myRole, audience, text: input.trim(), time: nowTime() },
    ])
    setInput('')
  }

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
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Virtual Classroom</h1>
                <p className="text-white/70 text-sm">Create or join sessions and collaborate with peers.</p>
              </div>
            </div>
          </div>

          {/* Create Session */}
          <form onSubmit={createSession} className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
            <div className="lg:col-span-2">
              <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Session title (e.g., DAA Mock Test Review)" className="w-full px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-white outline-none" />
            </div>
            <input value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})} placeholder="Subject" className="px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-white outline-none" />
            <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-white outline-none" />
            <div className="flex gap-3">
              <input type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} className="flex-1 px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-white outline-none" />
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white"><CalendarPlus className="w-4 h-4" /> Create</button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
              <Search className="w-5 h-5 text-white/70" />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search sessions..." className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60" />
            </div>
          </div>

          {/* Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {filtered.map(s => (
                <div key={s.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center items-start gap-3 sm:gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center"><Users className="w-6 h-6 text-white" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold truncate">{s.title}</div>
                    <div className="text-white/70 text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {s.date}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" /> {s.time}</span>
                      <span>{s.subject}</span>
                      <span>Host: {s.host}</span>
                      <span>{s.attendees} attending</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:ml-auto gap-2 w-full sm:w-auto">
                    <button onClick={()=>copyCode(s.code)} className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 w-full sm:w-auto"><Copy className="w-4 h-4"/> {s.code}</button>
                    <button className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm w-full sm:w-auto"><Video className="w-4 h-4"/> Join</button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (<div className="text-white/70">No sessions found. Create one above.</div>)}
            </div>

            {/* Chat */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-white" /><div className="text-white font-semibold">Classroom Chat</div></div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="text-white/70 text-xs">Role</div>
                  <select value={myRole} onChange={e=>setMyRole(e.target.value)} className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1">
                    <option>Teacher</option>
                    <option>TA</option>
                    <option>Student</option>
                  </select>
                  <div className="text-white/70 text-xs">View</div>
                  <select value={viewFilter} onChange={e=>setViewFilter(e.target.value)} className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-1">
                    <option>All</option>
                    <option>Teacher</option>
                    <option>TA</option>
                    <option>Student</option>
                  </select>
                  {myRole === 'Teacher' && (
                    <button onClick={()=>setMuteStudents(m=>!m)} title="Toggle student mute" className={`px-2 py-1 rounded-lg border text-xs ${muteStudents?'bg-red-500/30 border-red-400/50 text-white':'bg-white/10 border-white/20 text-white'}`}>
                      <Lock className="w-4 h-4 inline-block mr-1"/> {muteStudents?'Muted':'Unmuted'}
                    </button>
                  )}
                </div>
              </div>

              <div className="h-64 overflow-y-auto space-y-2 pr-1 custom-scroll">
                {visibleMessages.map(m => (
                  <div key={m.id} className="text-white/90 text-sm">
                    <span className="text-white/60">[{m.time}]</span> <span className="font-medium">{m.role}</span>
                    <span className="text-white/60"> → {m.audience}</span>: {m.text}
                  </div>
                ))}
                {visibleMessages.length===0 && (<div className="text-white/60 text-sm">No messages for this view.</div>)}
              </div>

              <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
                <div className="text-white/70 text-xs">To</div>
                <select value={audience} onChange={e=>setAudience(e.target.value)} className="bg-white/10 border border-white/20 text-white text-xs rounded-lg px-2 py-2">
                  <option>All</option>
                  <option>Teacher</option>
                  <option>TA</option>
                  <option>Student</option>
                </select>
                <input value={input} onChange={e=>setInput(e.target.value)} placeholder={muteStudents && myRole==='Student' ? 'Muted by teacher' : 'Type a message...'} disabled={myRole==='Student' && muteStudents} className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none" />
                <button type="submit" disabled={!canSend()} className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white disabled:opacity-40 inline-flex items-center gap-2"><Send className="w-4 h-4"/> Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default VirtualClassroomPage
