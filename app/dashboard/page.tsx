'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { Patient } from '@/types'
import styles from './page.module.css'

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/patients').then((r) => setPatients(r.data)).finally(() => setLoading(false))
  }, [])

  const totalCards = patients.reduce((acc, p) => acc + (p.prenatalCards?.length ?? 0), 0)

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral do consultório</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>♀</div>
          <div className={styles.statValue}>{patients.length}</div>
          <div className={styles.statLabel}>Pacientes</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>♥</div>
          <div className={styles.statValue}>{totalCards}</div>
          <div className={styles.statLabel}>Cartões ativos</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Pacientes recentes</h2>
          <Link href="/pacientes">
            <Button variant="ghost" size="sm">Ver todas →</Button>
          </Link>
        </div>

        {loading ? (
          <p className={styles.empty}>Carregando...</p>
        ) : patients.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>♀</div>
            <p>Nenhuma paciente cadastrada ainda.</p>
          </div>
        ) : (
          <div className={styles.patientList}>
            {patients.slice(0, 8).map((p) => (
              <Link key={p.id} href={`/pacientes/${p.id}`}>
                <div className={styles.patientRow}>
                  <div>
                    <div className={styles.patientName}>{p.name}</div>
                    <div className={styles.patientCpf}>CPF: {p.cpf}</div>
                  </div>
                  <div className={styles.patientCode}>{p.accessCode}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
