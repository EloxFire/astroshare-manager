import type { LucideIcon } from "lucide-react"
import type { DataRow } from "./DataRow"

export type DataTableRowAction<T extends DataRow> = {
  onClick: (row: T) => void | Promise<void>
  label?: string
  icon?: LucideIcon
  variant?: 'default' | 'danger' | 'ghost'
  disabled?: boolean
  confirm?: boolean | {
    message?: string
  }
}
