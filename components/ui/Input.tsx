import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={`${styles.field} ${error ? styles.error : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${className ?? ''}`} {...props} />
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}
