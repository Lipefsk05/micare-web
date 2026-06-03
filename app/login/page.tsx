'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { setToken } from '@/lib/auth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import styles from './page.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setToken(data.token)
      router.push('/dashboard')
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <div className={styles.brandName}>MiCare</div>
          <div className={styles.brandTag}>♥ Pré Natal</div>
        </div>
        <p className={styles.tagline}>
          Gerencie o acompanhamento das suas pacientes com carinho e precisão.
        </p>
      </div>

      <div className={styles.right}>
        <h2 className={styles.formTitle}>Bem-vinda de volta</h2>
        <p className={styles.formDesc}>Acesse o painel com suas credenciais.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            placeholder="sua@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className={styles.error}>{error}</div>}
          <Button type="submit" full loading={loading}>Entrar</Button>
        </form>

        <p className={styles.backLink}>
          <Link href="/">← Voltar para busca de cartão</Link>
        </p>
      </div>
    </div>
  )
}
