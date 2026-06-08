'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Patient, PrenatalCard, EXAM_LABELS } from '@/types'
import styles from './page.module.css'

function fmt(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-BR')
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}>{label}</div>
      <div className={styles.fieldValue}>
        {value !== undefined && value !== null && value !== ''
          ? value
          : <span className={styles.fieldEmpty}>—</span>}
      </div>
    </div>
  )
}

export default function CartaoPublicoPage() {
  const { id } = useParams<{ id: string }>()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [card, setCard] = useState<PrenatalCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        // Public endpoint: search by accessCode (id param is the access code in public URL)
        const { data: p } = await api.get(`/api/patients/search?accessCode=${encodeURIComponent(id)}`)
        setPatient(p)
        const cards = p.prenatalCards ?? []
        setCard(cards[0] ?? null)
      } catch (err) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.loading}>Carregando cartão...</p>
        </div>
      </div>
    )
  }

  if (notFound || !patient) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>♥</div>
            <h2 className={styles.notFoundTitle}>Cartão não encontrado</h2>
            <p className={styles.notFoundDesc}>Verifique os dados e tente novamente.</p>
            <Link href="/" className={styles.backLink}>← Voltar para a busca</Link>
          </div>
        </div>
      </div>
    )
  }

  const exams = card?.exams ?? []
  const consultations = card?.consultations ?? []

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.logo}>MiCare</div>
          <Link href="/" className={styles.backLink}>← Nova busca</Link>
        </div>

        {/* Cabeçalho da paciente */}
        <div className={styles.patientHeader}>
          <div className={styles.avatar}>{getInitials(patient.name)}</div>
          <div>
            <h1 className={styles.patientName}>{patient.name}</h1>
            <div className={styles.patientMeta}>
              {patient.emergencyPhone && `Emergência: ${patient.emergencyPhone}`}
            </div>
            {card?.doctor && (
              <div className={styles.badge}>Dra. {card.doctor.name} · CRM {card.doctor.crm}</div>
            )}
          </div>
        </div>

        {!card ? (
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <p className={styles.emptyState}>
                Nenhum cartão de pré natal disponível ainda.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Dados obstétricos */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>♥ Cartão Pré Natal</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Dados obstétricos</div>
                  <div className={styles.grid}>
                    <Field label="PNAR POR" value={card.pnarPor} />
                    <Field label="DUM" value={fmt(card.dum)} />
                    <Field label="DPP" value={fmt(card.dpp)} />
                    <Field label="1ª USG" value={fmt(card.firstUsg)} />
                    <Field label="IG" value={(function() {
                      if (card?.dum) {
                        const d = new Date(card.dum)
                        const today = new Date()
                        const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
                        const weeks = Math.floor(diff / 7)
                        const days = diff % 7
                        return `${weeks} semanas ${days} dias`
                      }
                      return card?.igWeeks ?? '—'
                    })()} />
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionTitle}>G · PC · PN · Ab</div>
                  <div className={styles.obsGrid}>
                    {[
                      { label: 'Gestações', value: card.gestacoes },
                      { label: 'Cesáreos', value: card.partosCesareos },
                      { label: 'Normais', value: card.partosNormais },
                      { label: 'Abortos', value: card.abortos },
                    ].map(({ label, value }) => (
                      <div key={label} className={styles.obsItem}>
                        <div className={styles.obsNum}>{value ?? '—'}</div>
                        <div className={styles.obsLabel}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionTitle}>Histórias clínicas</div>
                  <div className={styles.textGrid}>
                    {[
                      { label: 'HPP', value: card.hpp },
                      { label: 'HGO', value: card.hgo },
                      { label: 'HS', value: card.hs },
                      { label: 'HF', value: card.hf },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className={styles.fieldLabelWithMargin}>{label}</div>
                        <div className={`${styles.textBlock} ${!value ? styles.textEmpty : ''}`}>
                          {value || 'Não informado'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Exames */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Exames laboratoriais</div>
              </div>
              <div className={styles.cardBody}>
                {exams.length === 0 ? (
                  <p className={styles.examEmpty}>Nenhum exame registrado.</p>
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
                          <td>{exam.result1 || <span className={styles.examEmpty}>—</span>}</td>
                          <td>{fmt(exam.date1)}</td>
                          <td>{exam.result2 || <span className={styles.examEmpty}>—</span>}</td>
                          <td>{fmt(exam.date2)}</td>
                          <td>{exam.result3 || <span className={styles.examEmpty}>—</span>}</td>
                          <td>{fmt(exam.date3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Consultas */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Consultas</div>
              </div>
              <div className={styles.cardBody}>
                {consultations.length === 0 ? (
                  <p className={styles.examEmpty}>Nenhuma consulta registrada.</p>
                ) : (
                  <table className={styles.consultTable}>
                    <thead>
                      <tr>
                        <th>#</th><th>Data</th><th>Queixa</th><th>SS</th>
                        <th>Peso</th><th>PA</th><th>AI</th><th>Toque</th><th>Retorno</th><th>Conduta</th>
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
                          <td>{c.conduta || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
