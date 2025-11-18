import { AlertTriangle, Info, X, XCircle } from 'lucide-react'
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import '../../styles/components/toast.scss'

export type ToastType = 'neutral' | 'warning' | 'error'

export type ToastOptions = {
  type?: ToastType
  duration?: number
}

type ToastItem = {
  id: string
  message: string
  type: ToastType
}

type ToastContextValue = {
  showToast: (message: string, options?: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const iconByType: Record<ToastType, typeof Info> = {
  neutral: Info,
  warning: AlertTriangle,
  error: XCircle
}

const DEFAULT_DURATION = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutsRef = useRef<Record<string, number>>({})

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))

    const timeoutId = timeoutsRef.current[id]
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      delete timeoutsRef.current[id]
    }
  }, [])

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)
    const type = options?.type ?? 'neutral'
    const duration = options?.duration ?? DEFAULT_DURATION

    setToasts((prev) => [...prev, { id, message, type }])

    if (typeof window !== 'undefined') {
      const timeoutId = window.setTimeout(() => {
        removeToast(id)
      }, duration)

      timeoutsRef.current[id] = timeoutId
    }
  }, [removeToast])

  useEffect(() => () => {
    Object.values(timeoutsRef.current).forEach((timeoutId) => {
      window.clearTimeout(timeoutId)
    })
  }, [])

  const contextValue = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => {
          const Icon = iconByType[toast.type]

          return (
            <div
              key={toast.id}
              className={['toast', `toast--${toast.type}`].join(' ')}
            >
              <Icon size={16} aria-hidden="true" className="toast__icon" />
              <span className="toast__message">{toast.message}</span>
              <button
                type="button"
                className="toast__close"
                onClick={() => removeToast(toast.id)}
                aria-label="Fermer la notification"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
