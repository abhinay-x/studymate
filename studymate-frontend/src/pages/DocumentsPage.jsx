import React, { useEffect, useMemo, useRef, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { Link } from 'react-router-dom'
import { BookOpen, Filter, Plus, Search, Upload, FileText, NotebookPen, Trash2, X, Loader2 } from 'lucide-react'

// Simple local storage helpers
const STORAGE_KEY = 'studymate_docs'
const loadDocs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
const saveDocs = (docs) => localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))

const SUBJECTS = [
  'Data Structures',
  'Algorithms',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Discrete Mathematics',
  'COA',
  'DAA',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Electronics',
  'Electrical',
  'Mechanical',
  'Civil',
  'AI/ML',
  'Others',
]

const readableSize = (bytes) => {
  if (!bytes && bytes !== 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) { val /= 1024; i++ }
  return `${val.toFixed(1)} ${units[i]}`
}

const DocumentsPage = () => {
  const [docs, setDocs] = useState([])
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('Data Structures')
  const [isNotesOpen, setNotesOpen] = useState(false)
  const [notesDocId, setNotesDocId] = useState(null)
  const [notesContent, setNotesContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { setDocs(loadDocs()) }, [])
  useEffect(() => { saveDocs(docs) }, [docs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return docs.filter(d =>
      (subject === 'All' || d.subject === subject) &&
      (!q || d.name.toLowerCase().includes(q))
    )
  }, [docs, query, subject])

  const onUpload = async (files) => {
    if (!files || !files.length) return
    const added = Array.from(files).map(f => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: f.name,
      type: f.type || 'application/octet-stream',
      size: f.size,
      subject: selectedSubject,
      uploadedAt: new Date().toISOString(),
      notes: '',
    }))
    setDocs(prev => [...added, ...prev])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDelete = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  const openNotes = (doc) => {
    setNotesDocId(doc.id)
    setNotesContent(doc.notes || '')
    setNotesOpen(true)
  }

  const generateNotes = async () => {
    // Mock generation; integrate backend here later
    setGenerating(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      const base = `Summary Notes for ${docs.find(d => d.id === notesDocId)?.name || 'Document'}\n\n`
      const mock = base +
        '- Key concepts: data structures, complexity, memory.\n' +
        '- Important formulas/definitions listed succinctly.\n' +
        '- Sample questions and short answers included.\n' +
        '- Action plan: revise topics, attempt practice problems.'
      setNotesContent(mock)
    } finally {
      setGenerating(false)
    }
  }

  const saveNotes = () => {
    if (!notesDocId) return
    setDocs(prev => prev.map(d => d.id === notesDocId ? { ...d, notes: notesContent } : d))
    setNotesOpen(false)
  }

  return (
    <PageLayout showBackground={false} showBlobs={false}>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl backdrop-blur flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Documents</h1>
                <p className="text-white/70 text-sm">Upload, tag by subject, filter quickly, and generate concise notes.</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm">
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-black cursor-pointer shadow">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input ref={fileInputRef} onChange={e => onUpload(e.target.files)} type="file" multiple className="hidden" />
              </label>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
                <Search className="w-5 h-5 text-white/70" />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by filename..." className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
                <Filter className="w-5 h-5 text-white/70" />
                <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-1 bg-transparent text-black outline-none">
                  <option value="All">All Subjects</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:hidden">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white cursor-pointer shadow">
                  <Plus className="w-4 h-4" />
                  <input ref={fileInputRef} onChange={e => onUpload(e.target.files)} type="file" multiple className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Docs List */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-12 px-4 py-3 text-white/70 text-xs sm:text-sm border-b border-white/10">
              <div className="col-span-6 sm:col-span-5">Name</div>
              <div className="hidden sm:block sm:col-span-3">Subject</div>
              <div className="hidden md:block md:col-span-2">Size</div>
              <div className="col-span-6 sm:col-span-4 text-right pr-2">Actions</div>
            </div>
            {filtered.length === 0 && (
              <div className="p-6 text-white/70">No documents yet. Upload PDFs, PPTs, or images and tag with subjects.</div>
            )}
            {filtered.map(doc => (
              <div key={doc.id} className="grid grid-cols-12 items-center px-4 py-3 border-t border-white/10 hover:bg-white/5">
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="truncate text-white">{doc.name}</div>
                </div>
                <div className="hidden sm:block sm:col-span-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs">{doc.subject}</span>
                </div>
                <div className="hidden md:block md:col-span-2 text-white/80">{readableSize(doc.size)}</div>
                <div className="col-span-6 sm:col-span-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openNotes(doc)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20">
                      <NotebookPen className="w-4 h-4" /> Notes
                    </button>
                    <Link to="#" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20">
                      <BookOpen className="w-4 h-4" /> Open
                    </Link>
                    <button onClick={() => handleDelete(doc.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm hover:bg-red-500/30">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer helper */}
          <div className="mt-6 text-white/60 text-sm">
            Tip: Select a default subject on the right, then upload multiple files at once. Use the Notes action to auto-generate study notes.
          </div>
        </div>

        {/* Notes Modal */}
        {isNotesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setNotesOpen(false)} />
            <div className="relative w-[92%] max-w-2xl bg-slate-900 text-white rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <NotebookPen className="w-5 h-5" />
                  <span className="font-semibold">Generate Notes</span>
                </div>
                <button onClick={() => setNotesOpen(false)} className="p-1 rounded hover:bg-white/10"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-3">
                <div className="text-sm text-white/70">Powered by GPT (mocked). Connect your backend to replace this with real AI-generated notes.</div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-white/80">Notes</label>
                    <button disabled={generating} onClick={generateNotes} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm disabled:opacity-60">
                      {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <NotebookPen className="w-4 h-4" />}
                      {generating ? 'Generating...' : 'Generate with GPT'}
                    </button>
                  </div>
                  <textarea value={notesContent} onChange={e => setNotesContent(e.target.value)} rows={10} className="w-full rounded-xl bg-white/5 border border-white/20 outline-none p-3 text-white" placeholder="Your notes will appear here..." />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-white/10 bg-white/5">
                <button onClick={() => setNotesOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20">Cancel</button>
                <button onClick={saveNotes} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default DocumentsPage
