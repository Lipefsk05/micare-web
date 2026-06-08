'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { PrenatalCard } from '@/types'
import styles from './CardForm.module.css'

interface CardFormProps {
  patientId: string
  card?: PrenatalCard
  onClose: () => void
  onSave: () => void
}

export function CardForm({ patientId, card, onClose, onSave }: CardFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    pnarPor: '', dum: '', dpp: '', firstUsg: '', igWeeks: '',
    gestacoes: '', partosCesareos: '', partosNormais: '', abortos: '',
    hpp: '', hgo: '', hs: '', hf: '',
  })
  const [igDisplay, setIgDisplay] = useState('')

  useEffect(() => {
    if (card) {
      setForm({
        pnarPor: card.pnarPor ?? '',
        dum: card.dum?.split('T')[0] ?? '',
        dpp: card.dpp?.split('T')[0] ?? '',
        firstUsg: card.firstUsg?.split('T')[0] ?? '',
        igWeeks: card.igWeeks?.toString() ?? '',
        gestacoes: card.gestacoes?.toString() ?? '',
        partosCesareos: card.partosCesareos?.toString() ?? '',
        partosNormais: card.partosNormais?.toString() ?? '',
        abortos: card.abortos?.toString() ?? '',
        hpp: card.hpp ?? '',
        hgo: card.hgo ?? '',
        hs: card.hs ?? '',
        hf: card.hf ?? '',
      })
      if (card.dum) {
        const d = new Date(card.dum)
        const today = new Date()
        const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
        const weeks = Math.floor(diff / 7)
        const days = diff % 7
        setIgDisplay(`${weeks} semanas ${days} dias`)
      }
    }
  }, [card])

  useEffect(() => {
    if (form.dum) {
      const d = new Date(form.dum)
      const dppDate = new Date(d.getTime() + 280 * 24 * 60 * 60 * 1000)
      const isoDpp = dppDate.toISOString().slice(0, 10)
      const today = new Date()
      const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      const weeks = Math.floor(diff / 7)
      const days = diff % 7
      set('dpp', isoDpp)
      set('igWeeks', weeks.toString())
      setIgDisplay(`${weeks} semanas ${days} dias`)
    } else {
      setIgDisplay('')
    }
  }, [form.dum])

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const payload = {
        patientId,
        pnarPor: form.pnarPor || undefined,
        dum: form.dum || undefined,
        dpp: form.dpp || undefined,
        firstUsg: form.firstUsg || undefined,
        igWeeks: form.igWeeks ? Number(form.igWeeks) : undefined,
        gestacoes: form.gestacoes ? Number(form.gestacoes) : undefined,
        partosCesareos: form.partosCesareos ? Number(form.partosCesareos) : undefined,
        partosNormais: form.partosNormais ? Number(form.partosNormais) : undefined,
        abortos: form.abortos ? Number(form.abortos) : undefined,
        hpp: form.hpp || undefined,
        hgo: form.hgo || undefined,
        hs: form.hs || undefined,
        hf: form.hf || undefined,
      }
      if (card) {
        await api.put(`/api/cards/${card.id}`, payload)
      } else {
        await api.post('/api/cards', payload)
      }
      onSave()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao salvar cartão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{card ? 'Editar cartão' : 'Novo cartão'}</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Dados obstétricos</div>
            <div className={styles.grid}>
              <div className={styles.full}>
                <label className={styles.fieldLabel}>PNAR — Procedência</label>
                <textarea
                  className={styles.textarea}
                  value={form.pnarPor}
                  onChange={(e) => set('pnarPor', e.target.value)}
                />
              </div>
              <Input label="DUM" type="date" value={form.dum} onChange={(e) => set('dum', e.target.value)} />
              <Input label="DPP" type="date" value={form.dpp} onChange={(e) => set('dpp', e.target.value)} />
              <Input label="1ª USG" type="date" value={form.firstUsg} onChange={(e) => set('firstUsg', e.target.value)} />
              <div>
                <Input label="IG (semanas)" type="number" value={form.igWeeks} readOnly />
                {igDisplay && <div className={styles.subtleDisplay}>{igDisplay}</div>}
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>G PC PN Ab</div>
            <div className={styles.obsRow}>
              <Input label="G (gestações)" type="number" value={form.gestacoes} onChange={(e) => set('gestacoes', e.target.value)} />
              <Input label="PC (cesáreos)" type="number" value={form.partosCesareos} onChange={(e) => set('partosCesareos', e.target.value)} />
              <Input label="PN (normais)" type="number" value={form.partosNormais} onChange={(e) => set('partosNormais', e.target.value)} />
              <Input label="Ab (abortos)" type="number" value={form.abortos} onChange={(e) => set('abortos', e.target.value)} />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Histórias clínicas</div>
            <div className={styles.grid}>
              {[
                { key: 'hpp', label: 'HPP — Hist. Patológica Pregressa' },
                { key: 'hgo', label: 'HGO — Hist. Gineco-Obstétrica' },
                { key: 'hs', label: 'HS — Hist. Social' },
                { key: 'hf', label: 'HF — Hist. Familiar' },
              ].map(({ key, label }) => (
                <div key={key} className={styles.full}>
                  <label className={styles.fieldLabel}>{label}</label>
                  <textarea
                    className={styles.textarea}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => set(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={loading}>{card ? 'Salvar alterações' : 'Criar cartão'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
