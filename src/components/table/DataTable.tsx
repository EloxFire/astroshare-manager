import type { LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import '../../styles/components/data-table.scss'

type DataRow = Record<string, unknown>

export type DataTableColumn<T extends DataRow> = {
  header: string
  key?: keyof T
  accessor?: (row: T) => ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
  width?: string
}

export type DataTableRowAction<T extends DataRow> = {
  label: string
  onClick: (row: T) => void
  icon?: LucideIcon
  variant?: 'default' | 'danger' | 'ghost'
  disabled?: boolean
}

type DataTableProps<T extends DataRow> = {
  data: T[]
  columns: Array<DataTableColumn<T>>
  getRowId: (row: T, index: number) => string
  isLoading?: boolean
  loadingLabel?: string
  emptyLabel?: string
  className?: string
  rowActions?: Array<DataTableRowAction<T>>
  actionsHeader?: string
}

const alignmentClassname = (align: DataTableColumn<DataRow>['align']) => {
  if (!align) return ''
  return `data-table__cell--${align}`
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
                    {content ?? <span className="data-table__placeholder">—</span>}
                  </td>
                )
              })}

              {rowActions?.length ? (
                <td className="data-table__cell data-table__cell--right data-table__actions">
                  {rowActions.map((action) => {
                    const Icon = action.icon
                    const variant = action.variant ?? 'default'

                    return (
                      <button
                        key={`${rowId}-${action.label}`}
                        type="button"
                        className={[
                          'data-table__action',
                          `data-table__action--${variant}`
                        ].join(' ')}
                        onClick={() => action.onClick(row)}
                        disabled={action.disabled}
                      >
                        {Icon ? <Icon size={16} aria-hidden="true" /> : null}
                        <span>{action.label}</span>
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

