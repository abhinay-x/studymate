import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll window to top on route/pathname change
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    // Also attempt to scroll documentElement/body for cross-browser consistency
    const docEl = document.documentElement
    const body = document.body
    if (docEl) docEl.scrollTop = 0
    if (body) body.scrollTop = 0
  }, [pathname])

  return null
}
