'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { Consultation } from '@/types'
import styles from './ConsultationForm.module.css'

interface ConsultationFormProps {
  cardId: string
  consultation?: Consultation
  nextNumber?: number
  onClose: () => void
  onSave: () => void
}

export function ConsultationForm({ cardId, consultation, nextNumber, onClose, onSave }: ConsultationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    consultNumber: nextNumber ?? 1,
    date: '', complaint: '', ss: '', weight: '',
    pa: '', ai: '', touch: '', signature: '', returnDate: '',
  })

  useEffect(() => {
    if (consultation) {
      setForm({
        consultNumber: consultation.consultNumber,
        date: consultation.date?.split('T')[0] ?? '',
        complaint: consultation.complaint ?? '',
        ss: consultation.ss ?? '',
        weight: consultation.weight?.toString() ?? '',
        pa: consultation.pa ?? '',
        ai: consultation.ai ?? '',
        touch: consultation.touch ?? '',
        signature: consultation.signature ?? '',
        returnDate: consultation.returnDate?.split('T')[0] ?? '',
      })
    }
  }, [consultation])

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await api.put(`/api/cards/${cardId}/consultations`, {
        consultNumber: form.consultNumber,
        date: form.date || undefined,
        complaint: form.complaint || undefined,
        ss: form.ss || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        pa: form.pa || undefined,
        ai: form.ai || undefined,
        touch: form.touch || undefined,
        signature: form.signature || undefined,
        returnDate: form.returnDate || undefined,
      })
      onSave()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao salvar consulta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {consultation ? `Consulta ${consultation.consultNumber}ª` : `Nova consulta (${form.consultNumber}ª)`}
          </h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.grid}>
            <Input label="Data" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            <Input label="Retorno" type="date" value={form.returnDate} onChange={(e) => set('returnDate', e.target.value)} />
            <div className={styles.full}>
              <Input label="Queixa" placeholder="Queixa principal" value={form.complaint} onChange={(e) => set('complaint', e.target.value)} />
            </div>
            <Input label="SS (situação/apresentação)" value={form.ss} onChange={(e) => set('ss', e.target.value)} />
            <Input label="Peso (kg)" type="number" step="0.1" value={form.weight} onChange={(e) => set('weight', e.target.value)} />
            <Input label="PA (pressão arterial)" placeholder="120/80" value={form.pa} onChange={(e) => set('pa', e.target.value)} />
            <Input label="AI (altura uterina)" value={form.ai} onChange={(e) => set('ai', e.target.value)} />
            <Input label="Toque" value={form.touch} onChange={(e) => set('touch', e.target.value)} />
            <div className={styles.full}>
              <Input label="Assinatura" value={form.signature} onChange={(e) => set('signature', e.target.value)} />
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={loading}>Salvar consulta</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
