'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import styles from '../../nova/page.module.css'

export default function EditarPacientePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', cpf: '', birthDate: '', phone: '', emergencyPhone: '' })

  useEffect(() => {
    api.get(`/api/patients/${id}`).then(({ data }) => {
      setForm({
        name: data.name,
        cpf: data.cpf,
        birthDate: data.birthDate?.split('T')[0] ?? '',
        phone: data.phone ?? '',
        emergencyPhone: data.emergencyPhone ?? '',
      })
    })
  }, [id])

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await api.put(`/api/patients/${id}`, { ...form, cpf: form.cpf.replace(/\D/g, '') })
      router.push(`/pacientes/${id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao atualizar paciente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className={styles.header}>
        <h1 className={styles.title}>Editar Paciente</h1>
        <p className={styles.subtitle}>Atualize os dados da paciente.</p>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <span className={styles.sectionLabel}>Dados pessoais</span>
          <div className={styles.full}>
            <Input label="Nome completo" value={form.name} onChange={(e) => set('name', e.target.value)} required />
          </div>
          <Input label="CPF" value={form.cpf} onChange={(e) => set('cpf', e.target.value)} required />
          <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} required />
          <hr className={styles.divider} />
          <span className={styles.sectionLabel}>Contato</span>
          <Input label="Telefone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="Telefone de emergência" value={form.emergencyPhone} onChange={(e) => set('emergencyPhone', e.target.value)} />
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.actions}>
          <Link href={`/pacientes/${id}`}><Button variant="secondary" type="button">Cancelar</Button></Link>
          <Button type="submit" loading={loading}>Salvar alterações</Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
