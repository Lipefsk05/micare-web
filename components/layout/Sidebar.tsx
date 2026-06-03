'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { removeToken } from '@/lib/auth'
import styles from './Sidebar.module.css'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/pacientes', label: 'Pacientes', icon: '♀' },
]

interface SidebarProps {
  user?: { name: string; crm: string }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    removeToken()
    router.push('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoTitle}>MiCare</div>
        <div className={styles.logoSub}>Pré Natal</div>
      </div>
      <nav className={styles.nav}>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`${styles.link} ${pathname.startsWith(l.href) ? styles.active : ''}`}
          >
            <span className={styles.icon}>{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className={styles.bottom}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userCrm}>CRM {user.crm}</div>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout}>Sair</button>
      </div>
    </aside>
  )
}
