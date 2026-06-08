'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import { Exam, EXAM_LABELS, EXAM_TYPES } from '@/types'
import styles from './ExamForm.module.css'

interface ExamFormProps {
  cardId: string
  exams: Exam[]
  onClose: () => void
  onSave: () => void
}

type ExamRow = {
  result1: string; date1: string
  result2: string; date2: string
  result3: string; date3: string
}

export function ExamForm({ cardId, exams, onClose, onSave }: ExamFormProps) {
  const [loading, setLoading] = useState(false)
  const [applyDate1, setApplyDate1] = useState('')
  const [applyDate2, setApplyDate2] = useState('')
  const [applyDate3, setApplyDate3] = useState('')

  const initial: Record<string, ExamRow> = {}
  EXAM_TYPES.forEach((type) => {
    const found = exams.find((e) => e.type === type)
    initial[type] = {
      result1: found?.result1 ?? '', date1: found?.date1?.split('T')[0] ?? '',
      result2: found?.result2 ?? '', date2: found?.date2?.split('T')[0] ?? '',
      result3: found?.result3 ?? '', date3: found?.date3?.split('T')[0] ?? '',
    }
  })

  const [rows, setRows] = useState<Record<string, ExamRow>>(initial)

  function set(type: string, field: keyof ExamRow, value: string) {
    setRows((prev) => ({ ...prev, [type]: { ...prev[type], [field]: value } }))
  }

  async function handleSave() {
    setLoading(true)
    try {
      const promises = EXAM_TYPES
        .filter((type) => {
          const r = rows[type]
          return r.result1 || r.result2 || r.result3
        })
        .map((type) => {
          const r = rows[type]
          return api.put(`/api/cards/${cardId}/exams`, {
            type,
            result1: r.result1 || undefined, date1: r.date1 || undefined,
            result2: r.result2 || undefined, date2: r.date2 || undefined,
            result3: r.result3 || undefined, date3: r.date3 || undefined,
          })
        })
      await Promise.all(promises)
      onSave()
    } finally {
      setLoading(false)
    }
  }

  function applyDate1ToAll() {
    if (!applyDate1) return
    const updated: Record<string, ExamRow> = {}
    Object.keys(rows).forEach((type) => {
      const r = rows[type]
      updated[type] = { ...r, date1: applyDate1 }
    })
    setRows(updated)
  }

  function applyDate2ToAll() {
    if (!applyDate2) return
    const updated: Record<string, ExamRow> = {}
    Object.keys(rows).forEach((type) => {
      const r = rows[type]
      updated[type] = { ...r, date2: applyDate2 }
    })
    setRows(updated)
  }

  function applyDate3ToAll() {
    if (!applyDate3) return
    const updated: Record<string, ExamRow> = {}
    Object.keys(rows).forEach((type) => {
      const r = rows[type]
      updated[type] = { ...r, date3: applyDate3 }
    })
    setRows(updated)
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Exames laboratoriais</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--purple-dark)', whiteSpace: 'nowrap' }}>1ª Data</label>
            <input type="date" className={styles.input} value={applyDate1} onChange={(e) => setApplyDate1(e.target.value)} />
            <button type="button" onClick={applyDate1ToAll} style={{ padding: '6px 8px', borderRadius: 6, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Aplicar</button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--purple-dark)', whiteSpace: 'nowrap' }}>2ª Data</label>
            <input type="date" className={styles.input} value={applyDate2} onChange={(e) => setApplyDate2(e.target.value)} />
            <button type="button" onClick={applyDate2ToAll} style={{ padding: '6px 8px', borderRadius: 6, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Aplicar</button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--purple-dark)', whiteSpace: 'nowrap' }}>3ª Data</label>
            <input type="date" className={styles.input} value={applyDate3} onChange={(e) => setApplyDate3(e.target.value)} />
            <button type="button" onClick={applyDate3ToAll} style={{ padding: '6px 8px', borderRadius: 6, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Aplicar</button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Exame</th>
              <th>1º Resultado</th><th>1ª Data</th>
              <th>2º Resultado</th><th>2ª Data</th>
              <th>3º Resultado</th><th>3ª Data</th>
            </tr>
          </thead>
          <tbody>
            {EXAM_TYPES.map((type) => (
              <tr key={type}>
                <td className={styles.examName}>{EXAM_LABELS[type]}</td>
                {(['result1','date1','result2','date2','result3','date3'] as (keyof ExamRow)[]).map((field) => (
                  <td key={field}>
                    <input
                      className={styles.input}
                      type={field.startsWith('date') ? 'date' : 'text'}
                      value={rows[type][field]}
                      onChange={(e) => set(type, field, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} loading={loading}>Salvar exames</Button>
        </div>
      </div>
    </div>
  )
}
