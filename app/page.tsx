'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import styles from './page.module.css'

type Tab = 'nome' | 'cpf' | 'codigo'

export default function HomePage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('nome')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const labels: Record<Tab, string> = {
    nome: 'Nome completo',
    cpf: 'CPF (somente números)',
    codigo: 'Código de acesso',
  }

  const placeholders: Record<Tab, string> = {
    nome: 'Ex: Maria da Silva',
    cpf: 'Ex: 12345678901',
    codigo: 'Ex: A3F2C1B9',
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim()) { setError('Preencha o campo de busca.'); return }
    setLoading(true); setError('')
    try {
      const params: Record<string, string> = {}
      if (tab === 'nome') params.q = value
      if (tab === 'cpf') params.cpf = value
      if (tab === 'codigo') params.accessCode = value
      const { data } = await api.get('/api/patients/search', { params })
      router.push(`/cartao/${data.id}`)
    } catch {
      setError('Paciente não encontrada. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.badge}>♥ Cartão Digital</div>
        <h1 className={styles.title}>MiCare</h1>
        <p className={styles.subtitle}>Consulte seu cartão de pré natal de qualquer lugar, a qualquer momento.</p>
      </div>

      <div className={styles.searchCard}>
        <h2 className={styles.searchTitle}>Encontrar meu cartão</h2>
        <p className={styles.searchDesc}>Busque pelo seu nome, CPF ou código de acesso fornecido pela médica.</p>

        <div className={styles.tabs}>
          {(['nome', 'cpf', 'codigo'] as Tab[]).map((t) => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.active : ''}`}
              onClick={() => { setTab(t); setValue(''); setError('') }}>
              {t === 'nome' ? 'Nome' : t === 'cpf' ? 'CPF' : 'Código'}
            </button>
          ))}
        </div>

        <form className={styles.form} onSubmit={handleSearch}>
          <Input
            label={labels[tab]}
            placeholder={placeholders[tab]}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" full loading={loading}>Buscar cartão</Button>
        </form>

        <p className={styles.doctorLink}>
          É médica? <Link href="/login">Acesse o painel →</Link>
        </p>
      </div>
    </div>
  )
}
