'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { Patient } from '@/types'
import styles from './page.module.css'

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/patients', { params: search ? { q: search } : {} })
      setPatients(data)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchPatients, 300)
    return () => clearTimeout(t)
  }, [fetchPatients])

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  }

  function formatCpf(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Pacientes</h1>
          <p className={styles.subtitle}>{patients.length} paciente{patients.length !== 1 ? 's' : ''} cadastrada{patients.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/pacientes/nova">
          <Button>+ Nova paciente</Button>
        </Link>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '48px' }}>Carregando...</p>
      ) : patients.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>♀</div>
          <p className={styles.emptyText}>Nenhuma paciente encontrada.</p>
          <Link href="/pacientes/nova"><Button>Cadastrar primeira paciente</Button></Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {patients.map((p) => (
            <Link key={p.id} href={`/pacientes/${p.id}`}>
              <div className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.avatar}>{getInitials(p.name)}</div>
                  <span className={styles.code}>{p.accessCode}</span>
                </div>
                <div className={styles.name}>{p.name}</div>
                <div className={styles.info}>CPF: {formatCpf(p.cpf)}</div>
                {p.phone && <div className={styles.info}>Tel: {p.phone}</div>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
