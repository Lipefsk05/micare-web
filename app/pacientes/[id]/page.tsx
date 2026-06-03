'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { CardView } from '@/components/cartao/CardView'
import { CardForm } from '@/components/cartao/CardForm'
import { api } from '@/lib/api'
import { Patient, PrenatalCard } from '@/types'
import styles from './page.module.css'

type Tab = 'cartao' | 'dados'

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [card, setCard] = useState<PrenatalCard | null>(null)
  const [tab, setTab] = useState<Tab>('cartao')
  const [loading, setLoading] = useState(true)
  const [showCardForm, setShowCardForm] = useState(false)

  async function loadData() {
    try {
      const { data: p } = await api.get(`/api/patients/${id}`)
      setPatient(p)
      const { data: cards } = await api.get(`/api/patients/${id}/cards`)
      setCard(cards[0] ?? null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [id])

  async function handleDelete() {
    if (!confirm(`Excluir paciente ${patient?.name}? Esta ação não pode ser desfeita.`)) return
    await api.delete(`/api/patients/${id}`)
    router.push('/pacientes')
  }

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  }

  if (loading) return <DashboardLayout><p style={{ color: 'var(--text-muted)' }}>Carregando...</p></DashboardLayout>
  if (!patient) return <DashboardLayout><p>Paciente não encontrada.</p></DashboardLayout>

  return (
    <DashboardLayout>
      <Link href="/pacientes" className={styles.back}>← Voltar para pacientes</Link>

      <div className={styles.header}>
        <div className={styles.patientInfo}>
          <div className={styles.avatar}>{getInitials(patient.name)}</div>
          <div>
            <h1 className={styles.name}>{patient.name}</h1>
            <div className={styles.meta}>CPF: {patient.cpf} {patient.phone && `· Tel: ${patient.phone}`}</div>
            <div className={styles.code}>Código de acesso: {patient.accessCode}</div>
          </div>
        </div>
        <div className={styles.actions}>
          <Link href={`/pacientes/${id}/editar`}>
            <Button variant="ghost" size="sm">Editar dados</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>Excluir</Button>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'cartao' ? styles.tabActive : ''}`} onClick={() => setTab('cartao')}>Cartão Pré Natal</button>
        <button className={`${styles.tab} ${tab === 'dados' ? styles.tabActive : ''}`} onClick={() => setTab('dados')}>Dados da paciente</button>
      </div>

      {tab === 'cartao' && (
        <div className={styles.cardSection}>
          {card ? (
            <CardView card={card} onRefresh={loadData} />
          ) : (
            <div className={styles.noCard}>
              <div className={styles.noCardIcon}>♥</div>
              <p>Nenhum cartão de pré natal criado ainda.</p>
              <Button style={{ marginTop: '16px' }} onClick={() => setShowCardForm(true)}>Criar cartão</Button>
            </div>
          )}
          {showCardForm && (
            <CardForm
              patientId={patient.id}
              onClose={() => setShowCardForm(false)}
              onSave={() => { setShowCardForm(false); loadData() }}
            />
          )}
        </div>
      )}

      {tab === 'dados' && (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--pink-mid)', padding: '32px' }}>
          <DataRow label="Nome" value={patient.name} />
          <DataRow label="CPF" value={patient.cpf} />
          <DataRow label="Data de nascimento" value={new Date(patient.birthDate).toLocaleDateString('pt-BR')} />
          <DataRow label="Telefone" value={patient.phone ?? '—'} />
          <DataRow label="Telefone de emergência" value={patient.emergencyPhone ?? '—'} />
          <DataRow label="Código de acesso" value={patient.accessCode} />
        </div>
      )}
    </DashboardLayout>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--pink-light)' }}>
      <span style={{ width: '200px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'var(--text-body)' }}>{value}</span>
    </div>
  )
}
