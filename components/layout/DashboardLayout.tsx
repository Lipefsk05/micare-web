'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { api } from '@/lib/api'
import { Sidebar } from './Sidebar'
import { User } from '@/types'
import styles from './DashboardLayout.module.css'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return }
    api.get('/api/auth/me').then((r) => setUser(r.data)).catch(() => router.push('/login'))
  }, [router])

  return (
    <div className={styles.wrapper}>
      <Sidebar user={user ?? undefined} />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
