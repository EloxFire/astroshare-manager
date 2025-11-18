import type { ReactNode } from "react"
import type { DataRow } from "./DataRow"

export type DataTableColumn<T extends DataRow> = {
  header: string
  key?: keyof T
  accessor?: (row: T) => ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
  width?: string
  copy?: boolean | {
    label?: string
    getValue?: (row: T) => string | number | boolean | null | undefined
    successMessage?: string
    errorMessage?: string
  }
}
