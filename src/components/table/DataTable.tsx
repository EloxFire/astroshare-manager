import { Copy } from 'lucide-react'
import { type ReactNode } from 'react'
import type { DataTableColumn } from '../../helpers/types/table/DataTableColumn'
import type { DataRow } from '../../helpers/types/table/DataRow'
import type { DataTableProps } from '../../helpers/types/table/DataTableProps'
import { useToast } from '../../hooks/useToast'
import '../../styles/components/data-table.scss'

const alignmentClassname = (align: DataTableColumn<DataRow>['align']) => {
  if (!align) return ''
  return `data-table__cell--${align}`
}

const parseCopyValue = (value: unknown) => {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return undefined
}

const writeToClipboard = async (value: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // No fallback needed here, we'll try the manual approach below.
    }
  }

  if (typeof document === 'undefined') return false

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  try {
    document.execCommand('copy')
    return true
  } catch {
    // Ignore copy errors.
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

export function DataTable<T extends DataRow>({
  data,
  columns,
  getRowId,
  isLoading = false,
  loadingLabel = 'Chargement…',
  emptyLabel = 'Aucune donnée à afficher.',
  className,
  rowActions,
  actionsHeader = 'Actions'
}: DataTableProps<T>) {
  const tableClassNames = ['data-table', className].filter(Boolean).join(' ')
  const colSpan = columns.length + (rowActions?.length ? 1 : 0)
  const { showToast } = useToast()

  return (
    <table className={tableClassNames}>
      <thead className="data-table__head">
        <tr>
          {columns.map((column) => (
            <th
              key={column.header}
              className={[
                'data-table__header',
                column.className,
                alignmentClassname(column.align)
              ].filter(Boolean).join(' ')}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.header}
            </th>
          ))}
          {rowActions?.length ? (
            <th className="data-table__header data-table__cell--right data-table__header--actions">
              {actionsHeader}
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td className="data-table__cell data-table__cell--loading" colSpan={colSpan}>
              {loadingLabel}
            </td>
          </tr>
        ) : null}

        {!isLoading && !data.length ? (
          <tr>
            <td className="data-table__cell data-table__cell--empty" colSpan={colSpan}>
              {emptyLabel}
            </td>
          </tr>
        ) : null}

        {!isLoading && data.map((row, index) => {
          const rowId = getRowId(row, index)

          return (
            <tr key={rowId}>
              {columns.map((column) => {
                const content = column.accessor
                  ? column.accessor(row)
                  : column.key
                    ? (row[column.key] as ReactNode ?? <span className="data-table__placeholder">—</span>)
                    : null

                return (
                  <td
                    key={`${rowId}-${String(column.key ?? column.header)}`}
                    className={[
                      'data-table__cell',
                      column.className,
                      alignmentClassname(column.align)
                    ].filter(Boolean).join(' ')}
                  >
                    <div className="data-table__cell-content">
                      {content ?? <span className="data-table__placeholder">—</span>}

                      {(() => {
                        if (!column.copy) return null

                        const copySettings = column.copy === true ? {} : column.copy

                        const resolvedValue = copySettings?.getValue
                          ? copySettings.getValue(row)
                          : column.key
                            ? row[column.key]
                            : undefined

                        const copyValue = parseCopyValue(
                          resolvedValue ?? content
                        )

                        if (copyValue === undefined) return null

                        const label = copySettings?.label ?? `Copier ${column.header}`

                        return (
                          <button
                            type="button"
                            className="data-table__copy-button"
                            onClick={() => {
                              void (async () => {
                                const success = await writeToClipboard(copyValue)
                                const successMessage =
                                  copySettings?.successMessage
                                  ?? 'Copié dans le presse-papiers.'
                                const errorMessage =
                                  copySettings?.errorMessage
                                  ?? 'Impossible de copier ce contenu.'

                                showToast(
                                  success ? successMessage : errorMessage,
                                  { type: success ? 'neutral' : 'error' }
                                )
                              })()
                            }}
                            aria-label={label}
                          >
                            <Copy size={14} aria-hidden="true" />
                          </button>
                        )
                      })()}
                    </div>
                  </td>
                )
              })}

              {rowActions?.length ? (
                <td className="data-table__cell data-table__cell--right data-table__actions">
                  {rowActions.map((action) => {
                    const Icon = action.icon
                    const variant = action.variant ?? 'default'
                    const color = variant === 'danger' ? 'red' : undefined
                    const confirmSettings = typeof action.confirm === 'object' ? action.confirm : undefined
                    const confirmMessage = confirmSettings?.message ?? 'Êtes-vous sûr de vouloir effectuer cette action ?'

                    return (
                      <button
                        key={`${rowId}-${action.label}`}
                        type="button"
                        className={[
                          'data-table__action',
                          `data-table__action--${variant}`
                        ].join(' ')}
                        onClick={() => {
                          void (async () => {
                            if (action.confirm) {
                              if (typeof window === 'undefined') return
                              const shouldProceed = window.confirm(confirmMessage)
                              if (!shouldProceed) return
                            }
                            await action.onClick(row)
                          })()
                        }}
                        disabled={action.disabled}
                      >
                        {Icon ? <Icon size={16} aria-hidden="true" color={color} /> : null}
                        {
                          action.label ?
                          <span>{action.label}</span>
                          : null
                        }
                      </button>
                    )
                  })}
                </td>
              ) : null}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
