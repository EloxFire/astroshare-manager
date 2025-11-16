import '../styles/components/loader.scss'

type LoaderSize = 'small' | 'large'

interface LoaderProps {
  size?: LoaderSize
  label?: string
}

export const Loader = ({ size = 'small', label = 'Chargement en cours' }: LoaderProps) => (
  <span className={`loader loader--${size}`} role="status" aria-live="polite" aria-label={label}>
    <span className="loader__indicator" aria-hidden="true" />
  </span>
)
