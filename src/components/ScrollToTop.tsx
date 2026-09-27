import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const scrollToTarget = () => {
        const target = document.getElementById(id) ?? document.getElementById(`install-tab-${id}`)
        if (!target) return false
        target.scrollIntoView()
        return true
      }
      if (scrollToTarget()) return
      const observer = new MutationObserver(() => {
        if (scrollToTarget()) observer.disconnect()
      })
      observer.observe(document.body, { childList: true, subtree: true })
      const timeout = window.setTimeout(() => observer.disconnect(), 3000)
      return () => {
        observer.disconnect()
        window.clearTimeout(timeout)
      }
    }
    window.scrollTo(0, 0)
  }, [hash, pathname])
  return null
}
