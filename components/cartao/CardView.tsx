'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CardForm } from './CardForm'
import { ExamForm } from './ExamForm'
import { ConsultationForm } from './ConsultationForm'
import { PrenatalCard, EXAM_LABELS, Consultation } from '@/types'
import styles from './CardView.module.css'

interface CardViewProps {
  card: PrenatalCard
  onRefresh: () => void
}

function fmt(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-BR')
}

function val(v?: string | number | null) {
  if (v === undefined || v === null || v === '') return <span className={styles.fieldEmpty}>—</span>
  return v
}

export function CardView({ card, onRefresh }: CardViewProps) {
  const [editCard, setEditCard] = useState(false)
  const [editExams, setEditExams] = useState(false)
  const [editConsult, setEditConsult] = useState<Consultation | 'new' | null>(null)

  const exams = card.exams ?? []
  const consultations = card.consultations ?? []

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <Button variant="ghost" size="sm" onClick={() => setEditExams(true)}>Editar exames</Button>
        <Button variant="ghost" size="sm" onClick={() => setEditConsult('new')}>+ Consulta</Button>
        <Button variant="secondary" size="sm" onClick={() => setEditCard(true)}>Editar cartão</Button>
      </div>

      {/* CARTÃO PRINCIPAL */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <div className={styles.cardTitle}>♥ Cartão Pré Natal</div>
            {card.doctor && <div className={styles.cardDoctor}>Dra. {card.doctor.name} · CRM {card.doctor.crm}</div>}
          </div>
          <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>
            Criado em {fmt(card.createdAt)}
          </div>
        </div>

        <div className={styles.cardBody}>
          {/* Dados obstétricos */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Dados obstétricos</div>
            <div className={styles.grid}>
              {[
                { label: 'PNRH', value: card.pnrh },
                { label: 'PNAR POR', value: card.pnarPor },
                { label: 'DUM', value: fmt(card.dum) },
                { label: 'DPP', value: fmt(card.dpp) },
                { label: '1ª USG', value: fmt(card.firstUsg) },
                { label: 'IG (semanas)', value: card.igWeeks },
              ].map(({ label, value }) => (
                <div key={label} className={styles.field}>
                  <div className={styles.fieldLabel}>{label}</div>
                  <div className={styles.fieldValue}>{val(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* G PC PN Ab */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>G · PC · PN · Ab</div>
            <div className={styles.obsGrid}>
              {[
                { label: 'G', value: card.gestacoes, desc: 'Gestações' },
                { label: 'PC', value: card.partosCesareos, desc: 'Cesáreos' },
                { label: 'PN', value: card.partosNormais, desc: 'Normais' },
                { label: 'Ab', value: card.abortos, desc: 'Abortos' },
              ].map(({ label, value, desc }) => (
                <div key={label} className={styles.obsItem}>
                  <div className={styles.obsNum}>{value ?? '—'}</div>
                  <div className={styles.obsLabel}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórias clínicas */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Histórias clínicas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'HPP', value: card.hpp },
                { label: 'HGO', value: card.hgo },
                { label: 'HS', value: card.hs },
                { label: 'HF', value: card.hf },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className={styles.fieldLabel} style={{ marginBottom: '6px' }}>{label}</div>
                  <div className={`${styles.textBlock} ${!value ? styles.textEmpty : ''}`}>
                    {value || 'Não informado'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EXAMES */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Exames laboratoriais</div>
        </div>
        <div className={styles.cardBody}>
          {exams.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhum exame registrado.</p>
          ) : (
            <table className={styles.examTable}>
              <thead>
                <tr>
                  <th>Exame</th>
                  <th>1º Resultado</th><th>1ª Data</th>
                  <th>2º Resultado</th><th>2ª Data</th>
                  <th>3º Resultado</th><th>3ª Data</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id}>
                    <td className={styles.examName}>{EXAM_LABELS[exam.type] ?? exam.type}</td>
                    <td className={exam.result1 ? styles.examResult : styles.examEmpty}>{exam.result1 || '—'}</td>
                    <td className={styles.examDate}>{fmt(exam.date1)}</td>
                    <td className={exam.result2 ? styles.examResult : styles.examEmpty}>{exam.result2 || '—'}</td>
                    <td className={styles.examDate}>{fmt(exam.date2)}</td>
                    <td className={exam.result3 ? styles.examResult : styles.examEmpty}>{exam.result3 || '—'}</td>
                    <td className={styles.examDate}>{fmt(exam.date3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CONSULTAS */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>Consultas</div>
        </div>
        <div className={styles.cardBody}>
          {consultations.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Nenhuma consulta registrada.</p>
          ) : (
            <table className={styles.consultTable}>
              <thead>
                <tr>
                  <th>#</th><th>Data</th><th>Queixa</th><th>SS</th>
                  <th>Peso</th><th>PA</th><th>AI</th><th>Toque</th><th>Retorno</th><th></th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr key={c.id}>
                    <td><span className={styles.consultNum}>{c.consultNumber}</span></td>
                    <td>{fmt(c.date)}</td>
                    <td>{c.complaint || '—'}</td>
                    <td>{c.ss || '—'}</td>
                    <td>{c.weight ? `${c.weight}kg` : '—'}</td>
                    <td>{c.pa || '—'}</td>
                    <td>{c.ai || '—'}</td>
                    <td>{c.touch || '—'}</td>
                    <td>{fmt(c.returnDate)}</td>
                    <td>
                      <button className={styles.editBtn} onClick={() => setEditConsult(c)}>Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAIS */}
      {editCard && (
        <CardForm
          patientId={card.patientId}
          card={card}
          onClose={() => setEditCard(false)}
          onSave={() => { setEditCard(false); onRefresh() }}
        />
      )}
      {editExams && (
        <ExamForm
          cardId={card.id}
          exams={card.exams ?? []}
          onClose={() => setEditExams(false)}
          onSave={() => { setEditExams(false); onRefresh() }}
        />
      )}
      {editConsult !== null && (
        <ConsultationForm
          cardId={card.id}
          consultation={editConsult === 'new' ? undefined : editConsult}
          nextNumber={editConsult === 'new' ? (consultations.length + 1) : undefined}
          onClose={() => setEditConsult(null)}
          onSave={() => { setEditConsult(null); onRefresh() }}
        />
      )}
    </div>
  )
}
