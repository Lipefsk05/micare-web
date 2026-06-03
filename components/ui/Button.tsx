import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  full?: boolean
  loading?: boolean
}

export function Button({
  variant = 'primary', size = 'md', full, loading, children, className, ...props
}: ButtonProps) {
  return (
    <button
      className={[
        styles.btn,
        styles[variant],
        size !== 'md' ? styles[size] : '',
        full ? styles.full : '',
        className ?? '',
      ].join(' ')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Aguarde...' : children}
    </button>
  )
}
